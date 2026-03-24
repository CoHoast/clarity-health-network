/**
 * Change History Tracking
 * 
 * Tracks all changes to records with before/after values.
 * Provides full audit trail for compliance.
 */

import fs from 'fs';
import path from 'path';

export interface ChangeRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'restore';
  resourceType: 'provider' | 'practice' | 'contract' | 'credential' | 'user';
  resourceId: string;
  resourceName: string;
  changes: FieldChange[];
  metadata?: Record<string, any>;
}

export interface FieldChange {
  field: string;
  fieldLabel: string;
  oldValue: any;
  newValue: any;
}

const HISTORY_FILE = path.join(process.cwd(), 'data', 'change-history.json');
const MAX_HISTORY_RECORDS = 10000; // Keep last 10k records

/**
 * Load change history
 */
export function loadChangeHistory(): ChangeRecord[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading change history:', error);
  }
  return [];
}

/**
 * Save change history
 */
function saveChangeHistory(records: ChangeRecord[]): void {
  try {
    const dir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Keep only last MAX records
    const trimmed = records.slice(0, MAX_HISTORY_RECORDS);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2));
  } catch (error) {
    console.error('Error saving change history:', error);
  }
}

/**
 * Record a change
 */
export function recordChange(params: {
  userId: string;
  userName: string;
  action: ChangeRecord['action'];
  resourceType: ChangeRecord['resourceType'];
  resourceId: string;
  resourceName: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  metadata?: Record<string, any>;
}): ChangeRecord {
  const { userId, userName, action, resourceType, resourceId, resourceName, oldData, newData, metadata } = params;
  
  // Calculate field changes
  const changes: FieldChange[] = [];
  
  if (action === 'update' && oldData && newData) {
    const allFields = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
    
    for (const field of allFields) {
      const oldValue = oldData?.[field];
      const newValue = newData?.[field];
      
      // Skip internal fields
      if (field.startsWith('_') || ['id', 'createdAt', 'updatedAt'].includes(field)) {
        continue;
      }
      
      // Check if value changed
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field,
          fieldLabel: formatFieldLabel(field),
          oldValue: oldValue ?? null,
          newValue: newValue ?? null,
        });
      }
    }
  } else if (action === 'create' && newData) {
    // For creates, record all non-null fields
    for (const [field, value] of Object.entries(newData)) {
      if (value !== null && value !== undefined && value !== '' && !field.startsWith('_')) {
        changes.push({
          field,
          fieldLabel: formatFieldLabel(field),
          oldValue: null,
          newValue: value,
        });
      }
    }
  } else if (action === 'delete' && oldData) {
    // For deletes, record what was deleted
    for (const [field, value] of Object.entries(oldData)) {
      if (value !== null && value !== undefined && value !== '' && !field.startsWith('_')) {
        changes.push({
          field,
          fieldLabel: formatFieldLabel(field),
          oldValue: value,
          newValue: null,
        });
      }
    }
  }
  
  const record: ChangeRecord = {
    id: `CHG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action,
    resourceType,
    resourceId,
    resourceName,
    changes,
    metadata,
  };
  
  // Load, prepend, and save
  const history = loadChangeHistory();
  history.unshift(record);
  saveChangeHistory(history);
  
  return record;
}

/**
 * Get change history for a specific resource
 */
export function getResourceHistory(resourceType: string, resourceId: string): ChangeRecord[] {
  const history = loadChangeHistory();
  return history.filter(r => r.resourceType === resourceType && r.resourceId === resourceId);
}

/**
 * Get recent changes (for dashboard)
 */
export function getRecentChanges(limit: number = 50): ChangeRecord[] {
  const history = loadChangeHistory();
  return history.slice(0, limit);
}

/**
 * Get changes by user
 */
export function getChangesByUser(userId: string, limit: number = 100): ChangeRecord[] {
  const history = loadChangeHistory();
  return history.filter(r => r.userId === userId).slice(0, limit);
}

/**
 * Get changes by action type
 */
export function getChangesByAction(action: ChangeRecord['action'], limit: number = 100): ChangeRecord[] {
  const history = loadChangeHistory();
  return history.filter(r => r.action === action).slice(0, limit);
}

/**
 * Search changes
 */
export function searchChanges(query: string, limit: number = 100): ChangeRecord[] {
  const history = loadChangeHistory();
  const lowerQuery = query.toLowerCase();
  
  return history.filter(r => 
    r.resourceName.toLowerCase().includes(lowerQuery) ||
    r.resourceId.toLowerCase().includes(lowerQuery) ||
    r.userName.toLowerCase().includes(lowerQuery) ||
    r.changes.some(c => 
      String(c.oldValue).toLowerCase().includes(lowerQuery) ||
      String(c.newValue).toLowerCase().includes(lowerQuery)
    )
  ).slice(0, limit);
}

/**
 * Format field name to human-readable label
 */
function formatFieldLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1') // Add space before capitals
    .replace(/[_-]/g, ' ') // Replace underscores/hyphens with spaces
    .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
    .trim();
}

/**
 * Get summary stats for dashboard
 */
export function getChangeStats(): {
  totalChanges: number;
  todayChanges: number;
  weekChanges: number;
  byAction: Record<string, number>;
  byResource: Record<string, number>;
} {
  const history = loadChangeHistory();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekAgo = today - (7 * 24 * 60 * 60 * 1000);
  
  const stats = {
    totalChanges: history.length,
    todayChanges: 0,
    weekChanges: 0,
    byAction: {} as Record<string, number>,
    byResource: {} as Record<string, number>,
  };
  
  for (const record of history) {
    const recordTime = new Date(record.timestamp).getTime();
    
    if (recordTime >= today) stats.todayChanges++;
    if (recordTime >= weekAgo) stats.weekChanges++;
    
    stats.byAction[record.action] = (stats.byAction[record.action] || 0) + 1;
    stats.byResource[record.resourceType] = (stats.byResource[record.resourceType] || 0) + 1;
  }
  
  return stats;
}
