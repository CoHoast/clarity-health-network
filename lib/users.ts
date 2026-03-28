/**
 * User Management
 * 
 * Multi-user authentication with role-based access
 * Passwords are hashed with PBKDF2 (NIST recommended)
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const HASH_ITERATIONS = 100000;
const HASH_LENGTH = 64;
const HASH_ALGORITHM = 'sha512';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'staff' | 'viewer';
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  createdBy: string;
  lastLogin?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  active: boolean;
}

export type UserRole = User['role'];

// Role hierarchy (higher number = more permissions)
export const ROLE_LEVELS: Record<UserRole, number> = {
  viewer: 1,
  staff: 2,
  manager: 3,
  admin: 4,
  super_admin: 5,
};

// Hash password with salt
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGORITHM).toString('hex');
}

// Generate random salt
function generateSalt(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Load users from file
function loadUsers(): User[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
}

// Save users to file
function saveUsers(users: User[]): void {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/**
 * Create a new user
 */
export function createUser(params: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  createdBy: string;
}): User {
  const users = loadUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === params.email.toLowerCase())) {
    throw new Error('Email already exists');
  }
  
  const salt = generateSalt();
  const passwordHash = hashPassword(params.password, salt);
  
  const user: User = {
    id: `user_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`,
    email: params.email.toLowerCase(),
    name: params.name,
    role: params.role,
    passwordHash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
    mfaEnabled: false,
    active: true,
  };
  
  users.push(user);
  saveUsers(users);
  
  return user;
}

/**
 * Verify user credentials
 */
export function verifyCredentials(email: string, password: string): User | null {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.active);
  
  if (!user) {
    return null;
  }
  
  const inputHash = hashPassword(password, user.passwordSalt);
  
  // Constant-time comparison
  if (inputHash.length !== user.passwordHash.length) {
    return null;
  }
  
  let match = true;
  for (let i = 0; i < inputHash.length; i++) {
    if (inputHash[i] !== user.passwordHash[i]) {
      match = false;
    }
  }
  
  if (!match) {
    return null;
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString();
  saveUsers(users);
  
  return user;
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | null {
  const users = loadUsers();
  return users.find(u => u.id === id) || null;
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): User | null {
  const users = loadUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * List all users (without sensitive data)
 */
export function listUsers(): Omit<User, 'passwordHash' | 'passwordSalt' | 'mfaSecret'>[] {
  const users = loadUsers();
  return users.map(({ passwordHash, passwordSalt, mfaSecret, ...safe }) => safe);
}

/**
 * Update user
 */
export function updateUser(id: string, updates: Partial<Pick<User, 'name' | 'role' | 'active' | 'mfaEnabled'>>): User | null {
  const users = loadUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return null;
  }
  
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  
  return users[index];
}

/**
 * Change user password
 */
export function changePassword(id: string, newPassword: string): boolean {
  const users = loadUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return false;
  }
  
  const salt = generateSalt();
  users[index].passwordHash = hashPassword(newPassword, salt);
  users[index].passwordSalt = salt;
  
  saveUsers(users);
  return true;
}

/**
 * Delete user (soft delete - sets active to false)
 */
export function deleteUser(id: string): boolean {
  const users = loadUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return false;
  }
  
  users[index].active = false;
  saveUsers(users);
  return true;
}

/**
 * Check if user has required role level
 */
export function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

/**
 * Initialize with default super admin if no users exist
 * Uses environment variables for initial setup
 */
export function initializeDefaultAdmin(): void {
  const users = loadUsers();
  
  if (users.length > 0) {
    return; // Already has users
  }
  
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  
  if (!email || !password) {
    console.warn('[Users] No ADMIN_EMAIL/ADMIN_PASSWORD set, skipping default admin creation');
    return;
  }
  
  try {
    createUser({
      email,
      name: 'Super Admin',
      password,
      role: 'super_admin',
      createdBy: 'system',
    });
    console.log('[Users] Default super admin created');
  } catch (error) {
    console.error('[Users] Failed to create default admin:', error);
  }
}

/**
 * Get user count by role
 */
export function getUserStats(): Record<string, number> {
  const users = loadUsers();
  const stats: Record<string, number> = {
    total: users.length,
    active: users.filter(u => u.active).length,
  };
  
  for (const role of Object.keys(ROLE_LEVELS)) {
    stats[role] = users.filter(u => u.role === role && u.active).length;
  }
  
  return stats;
}
