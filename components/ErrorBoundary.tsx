"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    console.error("Error caught by boundary:", error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // Log to audit/error tracking service
    logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/admin";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-slate-400 mb-6">
              We encountered an unexpected error. This has been logged and our team will look into it.
            </p>
            
            {/* Error details (collapsed) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left mb-6 p-4 bg-slate-800 rounded-lg">
                <summary className="text-sm text-slate-400 cursor-pointer flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto max-h-32">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Log error to service (implement actual error tracking here)
 */
function logErrorToService(error: Error, errorInfo: ErrorInfo) {
  // In production, send to error tracking service like Sentry
  const errorData = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
  
  // For now, just log to console
  console.error("Error logged:", errorData);
  
  // In production, you would send this to your error tracking service:
  // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
}

/**
 * Hook version for functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  
  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error("Error handled:", error);
  }, []);
  
  const resetError = React.useCallback(() => {
    setError(null);
  }, []);
  
  // Throw to nearest error boundary
  if (error) {
    throw error;
  }
  
  return { handleError, resetError };
}

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Format error for API response
 */
export function formatApiError(error: unknown): {
  error: string;
  message: string;
  code: string;
  statusCode: number;
} {
  if (error instanceof ApiError) {
    return {
      error: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }
  
  if (error instanceof Error) {
    return {
      error: "Error",
      message: process.env.NODE_ENV === "development" 
        ? error.message 
        : "An unexpected error occurred",
      code: "INTERNAL_ERROR",
      statusCode: 500,
    };
  }
  
  return {
    error: "Error",
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    statusCode: 500,
  };
}
