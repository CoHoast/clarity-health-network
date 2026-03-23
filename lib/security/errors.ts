// Secure Error Handling
// Prevents leaking sensitive information in error responses

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: string;
}

// Standard error codes
export const ErrorCodes = {
  // Client errors
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

// User-friendly error messages (don't reveal internals)
const ERROR_MESSAGES: Record<string, string> = {
  BAD_REQUEST: 'The request could not be processed. Please check your input.',
  UNAUTHORIZED: 'Authentication required. Please log in.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'The provided data is invalid.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable.',
  DATABASE_ERROR: 'An unexpected error occurred. Please try again.',
};

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Create a secure error response
export function createErrorResponse(
  code: keyof typeof ErrorCodes,
  details?: string,
  originalError?: unknown
): Response {
  const status = getStatusCode(code);
  const message = ERROR_MESSAGES[code] || 'An error occurred.';
  
  const responseBody: ApiError = {
    status,
    code,
    message,
  };
  
  // Only include details in non-production or for non-sensitive errors
  if (details && (!isProduction || !isSensitiveError(code))) {
    responseBody.details = details;
  }
  
  // Log the full error server-side
  if (originalError) {
    console.error(`[API Error] ${code}:`, originalError);
  }
  
  return new Response(JSON.stringify(responseBody), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

// Get HTTP status code for error code
function getStatusCode(code: string): number {
  switch (code) {
    case 'BAD_REQUEST':
    case 'VALIDATION_ERROR':
      return 400;
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'RATE_LIMITED':
      return 429;
    case 'SERVICE_UNAVAILABLE':
      return 503;
    default:
      return 500;
  }
}

// Check if error is sensitive (shouldn't leak details)
function isSensitiveError(code: string): boolean {
  return ['INTERNAL_ERROR', 'DATABASE_ERROR', 'UNAUTHORIZED'].includes(code);
}

// Wrap an async handler with error handling
export function withErrorHandling(
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      // Log the error
      console.error('[Unhandled API Error]', error);
      
      // Check for specific error types
      if (error instanceof SyntaxError) {
        return createErrorResponse('BAD_REQUEST', 'Invalid JSON in request body');
      }
      
      // Return generic error
      return createErrorResponse('INTERNAL_ERROR', undefined, error);
    }
  };
}

// Create a success response
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

// Create a validation error response with field details
export function createValidationError(
  errors: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'The provided data is invalid.',
      errors,
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
