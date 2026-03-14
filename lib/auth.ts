import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medcare-health-demo-jwt-secret';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'member' | 'provider' | 'employer' | 'admin';
  name: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

export function verifyAuth(req: NextRequest): JWTPayload {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new Error('No token provided');
  }
  return verifyToken(token);
}

export function withAuth(
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>,
  allowedRoles?: ('member' | 'provider' | 'employer' | 'admin')[]
) {
  return async (req: NextRequest) => {
    try {
      const user = verifyAuth(req);
      
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      return handler(req, user);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}
