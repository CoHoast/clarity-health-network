/**
 * Import Session Management
 * 
 * Provides rollback capability for CSV imports:
 * - Creates a snapshot before import
 * - Tracks all changes (adds, updates, deletes)
 * - Allows full rollback to pre-import state
 */

import fs from 'fs';
import path from 'path';

export interface ImportChange {
  type: 'add' | 'update' | 'delete';
  npi: string;
  providerId: string;
  beforeState?: any; // State before change (for updates)
  afterState?: any;  // State after change
}

export interface ImportSession {
  id: string;
  createdAt: string;
  createdBy: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  
  // Results
  added: number;
  updated: number;
  skipped: number;
  errors: number;
  
  // For rollback
  changes: ImportChange[];
  
  // Status
  status: 'pending' | 'completed' | 'rolled_back' | 'failed';
  completedAt?: string;
  rolledBackAt?: string;
  rolledBackBy?: string;
  
  // Audit trail
  decisions: {
    npi: string;
    action: 'add' | 'skip' | 'merge' | 'error';
    reason?: string;
  }[];
}

const SESSIONS_FILE = path.join(process.cwd(), 'data', 'import-sessions.json');

// Load all import sessions
export function loadImportSessions(): ImportSession[] {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading import sessions:', error);
  }
  return [];
}

// Save all import sessions
export function saveImportSessions(sessions: ImportSession[]): void {
  try {
    const dir = path.dirname(SESSIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Error saving import sessions:', error);
    throw error;
  }
}

// Create a new import session
export function createImportSession(params: {
  fileName: string;
  fileSize: number;
  totalRows: number;
  createdBy: string;
}): ImportSession {
  const session: ImportSession = {
    id: `IMP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
    fileName: params.fileName,
    fileSize: params.fileSize,
    totalRows: params.totalRows,
    added: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    changes: [],
    decisions: [],
    status: 'pending',
  };
  
  const sessions = loadImportSessions();
  sessions.unshift(session); // Add to beginning (most recent first)
  
  // Keep only last 50 sessions
  if (sessions.length > 50) {
    sessions.splice(50);
  }
  
  saveImportSessions(sessions);
  return session;
}

// Update an import session
export function updateImportSession(sessionId: string, updates: Partial<ImportSession>): ImportSession | null {
  const sessions = loadImportSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  
  if (index === -1) return null;
  
  sessions[index] = { ...sessions[index], ...updates };
  saveImportSessions(sessions);
  return sessions[index];
}

// Get a specific import session
export function getImportSession(sessionId: string): ImportSession | null {
  const sessions = loadImportSessions();
  return sessions.find(s => s.id === sessionId) || null;
}

// Get recent import sessions
export function getRecentImportSessions(limit: number = 10): ImportSession[] {
  const sessions = loadImportSessions();
  return sessions.slice(0, limit);
}

// Rollback an import session
export function rollbackImportSession(sessionId: string, rolledBackBy: string): {
  success: boolean;
  message: string;
  restoredCount?: number;
  deletedCount?: number;
} {
  const session = getImportSession(sessionId);
  
  if (!session) {
    return { success: false, message: 'Import session not found' };
  }
  
  if (session.status === 'rolled_back') {
    return { success: false, message: 'This import has already been rolled back' };
  }
  
  if (session.status !== 'completed') {
    return { success: false, message: 'Can only rollback completed imports' };
  }
  
  // Load current providers
  const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
  let providers: any[] = [];
  
  try {
    providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
  } catch (error) {
    return { success: false, message: 'Failed to load providers data' };
  }
  
  let restoredCount = 0;
  let deletedCount = 0;
  
  // Reverse all changes
  for (const change of session.changes) {
    if (change.type === 'add') {
      // Remove added providers
      const index = providers.findIndex(p => p.npi === change.npi);
      if (index !== -1) {
        providers.splice(index, 1);
        deletedCount++;
      }
    } else if (change.type === 'update' && change.beforeState) {
      // Restore to before state
      const index = providers.findIndex(p => p.npi === change.npi);
      if (index !== -1) {
        providers[index] = change.beforeState;
        restoredCount++;
      }
    }
  }
  
  // Save updated providers
  try {
    fs.writeFileSync(providersFile, JSON.stringify(providers, null, 2));
  } catch (error) {
    return { success: false, message: 'Failed to save providers data' };
  }
  
  // Mark session as rolled back
  updateImportSession(sessionId, {
    status: 'rolled_back',
    rolledBackAt: new Date().toISOString(),
    rolledBackBy,
  });
  
  return {
    success: true,
    message: `Successfully rolled back import. Restored ${restoredCount} providers, deleted ${deletedCount} added providers.`,
    restoredCount,
    deletedCount,
  };
}

// Calculate import impact for warnings
export function calculateImportImpact(
  totalExisting: number,
  duplicates: number,
  newRows: number,
  mergeCount: number
): {
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  requiresConfirmation: boolean;
} {
  const warnings: string[] = [];
  let impactLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let requiresConfirmation = false;
  
  // Warning thresholds
  const updatePercentage = totalExisting > 0 ? (mergeCount / totalExisting) * 100 : 0;
  const addPercentage = totalExisting > 0 ? (newRows / totalExisting) * 100 : 0;
  
  // Check for high update percentage
  if (updatePercentage > 50) {
    impactLevel = 'critical';
    warnings.push(`⚠️ This import will UPDATE ${updatePercentage.toFixed(1)}% of existing providers`);
    requiresConfirmation = true;
  } else if (updatePercentage > 20) {
    impactLevel = 'high';
    warnings.push(`This import will update ${updatePercentage.toFixed(1)}% of existing providers`);
    requiresConfirmation = true;
  }
  
  // Check for large number of new providers
  if (newRows > 1000) {
    if (impactLevel !== 'critical') impactLevel = 'high';
    warnings.push(`Adding ${newRows.toLocaleString()} new providers`);
    requiresConfirmation = true;
  } else if (newRows > 100) {
    if (impactLevel === 'low') impactLevel = 'medium';
    warnings.push(`Adding ${newRows.toLocaleString()} new providers`);
  }
  
  // Check for massive growth
  if (addPercentage > 100) {
    impactLevel = 'critical';
    warnings.push(`⚠️ This will more than DOUBLE your provider count`);
    requiresConfirmation = true;
  } else if (addPercentage > 50) {
    if (impactLevel !== 'critical') impactLevel = 'high';
    warnings.push(`This will increase your provider count by ${addPercentage.toFixed(0)}%`);
    requiresConfirmation = true;
  }
  
  // All duplicates being skipped is safe
  if (duplicates > 0 && newRows === 0 && mergeCount === 0) {
    impactLevel = 'low';
    warnings.push(`✓ All ${duplicates.toLocaleString()} rows are duplicates - no changes will be made`);
  }
  
  return { impactLevel, warnings, requiresConfirmation };
}
