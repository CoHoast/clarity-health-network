// Simple in-memory session store
// In production, this should be Redis or a database

interface Session {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: number;
  expiresAt: number;
}

class SessionStore {
  private sessions: Map<string, Session> = new Map();
  
  create(email: string, name: string, role: string): string {
    const sessionId = `admin_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const session: Session = {
      id: sessionId,
      email,
      name,
      role,
      createdAt: now,
      expiresAt: now + (8 * 60 * 60 * 1000), // 8 hours
    };
    
    this.sessions.set(sessionId, session);
    
    // Clean up expired sessions
    this.cleanup();
    
    return sessionId;
  }
  
  get(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    // Check if expired
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    return session;
  }
  
  delete(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
  
  cleanup(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
      }
    }
  }
}

// Singleton instance
export const sessionStore = new SessionStore();