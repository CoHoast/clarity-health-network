/**
 * Secure Error Handler
 * 
 * Pen Test Requirement: Never expose stack traces or internal errors
 * SOC 2: Consistent error handling and logging
 */

import { NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';

// Generic error messages (never expose internals)
const SAFE_ERRORS: Record<string, { message: string; status: number }> = {
  BAD_REQUEST: { message: 'Invalid request', status: 400 },
  UNAUTHORIZED: { message: 'Authentication required', status: 401 },
  FORBIDDEN: { message: 'Access denied', status: 403 },
  NOT_FOUND: { message: 'Resource not found', status: 404 },
  METHOD_NOT_ALLOWED: { message: 'Method not allowed', status: 405 },
  CONFLICT: { message: 'Resource conflict', status: 409 },
  UNPROCESSABLE: { message: 'Invalid data provided', status: 422 },
  RATE_LIMITED: { message: 'Too many requests', status: 429 },
  SERVER_ERROR: { message: 'An error occurred', status: 500 },
  SERVICE_UNAVAILABLE: { message: 'Service temporarily unavailable', status: 503 },
};

export type ErrorCode = keyof typeof SAFE_ERRORS;

interface ErrorDetails {
  code: ErrorCode;
  internalMessage?: string; // For logging only, never sent to client
  field?: string; // For validation errors
  requestId?: string;
}

/**
 * Create a safe error response (no internal details exposed)
 */
export function safeErrorResponse(
  error: ErrorCode | ErrorDetails,
  internalError?: Error
): NextResponse {
  const details = typeof error === 'string' ? { code: error } : error;
  const { message, status } = SAFE_ERRORS[details.code] || SAFE_ERRORS.SERVER_ERROR;
  
  // Generate request ID for tracking
  const requestId = details.requestId || `req_${Date.now().toString(36)}`;
  
  // Log the full error internally (never sent to client)
  if (internalError || details.internalMessage) {
    console.error(`[${requestId}] ${details.code}:`, {
      internalMessage: details.internalMessage,
      error: internalError?.message,
      stack: process.env.NODE_ENV === 'development' ? internalError?.stack : undefined,
    });
  }
  
  // Return safe response
  return NextResponse.json(
    {
      error: message,
      code: details.code,
      requestId,
      ...(details.field && { field: details.field }),
    },
    { status }
  );
}

/**
 * Wrap async route handler with error catching
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  context?: { route: string; userId?: string }
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      const requestId = `req_${Date.now().toString(36)}`;
      
      // Log to audit trail
      if (context) {
        await logAuditEvent({
          user: context.userId || 'system',
          userId: context.userId || 'system',
          action: 'API Error',
          category: 'system',
          resource: context.route,
          resourceType: 'API',
          details: `Error in ${context.route}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ip: 'internal',
          userAgent: 'internal',
          sessionId: requestId,
          severity: 'warning',
          phiAccessed: false,
          success: false,
        });
      }
      
      // Return safe error
      return safeErrorResponse(
        { code: 'SERVER_ERROR', requestId },
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }) as T;
}

/**
 * Validate request body with safe error response
 */
export function validateRequest<T>(
  body: unknown,
  validator: (data: unknown) => { valid: boolean; errors?: { field: string; message: string }[] }
): { valid: true; data: T } | { valid: false; response: NextResponse } {
  const result = validator(body);
  
  if (!result.valid) {
    const firstError = result.errors?.[0];
    return {
      valid: false,
      response: safeErrorResponse({
        code: 'UNPROCESSABLE',
        field: firstError?.field,
        internalMessage: firstError?.message,
      }),
    };
  }
  
  return { valid: true, data: body as T };
}

/**
 * Safe JSON parse (never throws)
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Sanitize error for logging (remove sensitive data)
 */
export function sanitizeErrorForLog(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      // Only include stack in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(error)) {
      // Skip sensitive fields
      if (['password', 'token', 'secret', 'key', 'ssn', 'dob'].some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
  
  return { message: String(error) };
}
