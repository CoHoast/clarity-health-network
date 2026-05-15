import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sessionStore } from '../session-store';

// Environment variables for admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@truecare.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'PPO#Net123!';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Create session in memory store
    const sessionId = sessionStore.create(
      email,
      'SHN Admin User',
      'super_admin'
    );
    
    // Create response
    const response = NextResponse.json({
      success: true,
      sessionId,
      user: {
        email,
        name: 'SHN Admin User',
        role: 'super_admin'
      }
    });
    
    // Set a simple session cookie - just the ID
    // Use very basic settings that should work on any infrastructure
    response.headers.append(
      'Set-Cookie',
      `session=${sessionId}; Path=/; Max-Age=28800; HttpOnly; SameSite=Lax`
    );
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Login failed' 
    }, { status: 500 });
  }
}