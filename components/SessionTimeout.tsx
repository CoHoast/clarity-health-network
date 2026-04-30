/**
 * Session Timeout Component
 * 
 * Automatically monitors session and shows warnings before timeout
 * Redirects to login on expiration or idle timeout
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Clock, LogOut, RefreshCw } from 'lucide-react';

interface SessionTimeoutProps {
  enabled?: boolean;
}

export default function SessionTimeout({ enabled = true }: SessionTimeoutProps) {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<{
    authenticated: boolean;
    remainingMinutes: number;
    showWarning: boolean;
  } | null>(null);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check session status
  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session-check', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
        
        // Show timeout warning if needed
        if (data.showWarning && !showTimeoutModal) {
          setShowTimeoutModal(true);
        }
      } else {
        // Session expired or invalid
        handleSessionExpired();
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  // Handle session expiration
  const handleSessionExpired = () => {
    setSessionData(null);
    setShowTimeoutModal(false);
    
    // Clear any local storage
    localStorage.clear();
    
    // Redirect to login
    router.push('/admin-login?expired=true');
  };

  // Extend session
  const extendSession = async () => {
    try {
      // Check session again (this updates last activity on server)
      await checkSession();
      setShowTimeoutModal(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
      handleSessionExpired();
    }
  };

  // Track user activity
  const trackActivity = () => {
    setLastActivity(Date.now());
  };

  // Logout manually
  const logout = async () => {
    try {
      await fetch('/api/auth/session-check', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    
    handleSessionExpired();
  };

  // Check for idle timeout
  useEffect(() => {
    if (!enabled) return;

    const idleTimeout = 30 * 60 * 1000; // 30 minutes
    
    const checkIdle = () => {
      const idle = Date.now() - lastActivity;
      if (idle > idleTimeout) {
        console.log('Session idle timeout');
        handleSessionExpired();
      }
    };

    const idleInterval = setInterval(checkIdle, 60 * 1000); // Check every minute
    
    return () => clearInterval(idleInterval);
  }, [lastActivity, enabled]);

  // Activity listeners
  useEffect(() => {
    if (!enabled) return;

    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activities.forEach(activity => {
      document.addEventListener(activity, trackActivity, true);
    });

    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, trackActivity, true);
      });
    };
  }, [enabled]);

  // Session check interval
  useEffect(() => {
    if (!enabled) return;

    // Check immediately
    checkSession();
    
    // Check every 2 minutes
    const interval = setInterval(checkSession, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled || !sessionData?.authenticated) {
    return null;
  }

  return (
    <>
      {/* Session Status Indicator */}
      <div className="fixed top-4 right-4 z-40">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium shadow-lg border transition-colors ${
          sessionData.showWarning 
            ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300' 
            : 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
        }`}>
          <Clock className="w-3 h-3" />
          <span>Session: {sessionData.remainingMinutes}min</span>
          {sessionData.showWarning && (
            <AlertTriangle className="w-3 h-3" />
          )}
        </div>
      </div>

      {/* Timeout Warning Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Session Timeout Warning</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your session will expire in {sessionData.remainingMinutes} minute{sessionData.remainingMinutes !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={extendSession}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Stay Logged In
              </button>
              
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout Now
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
              Sessions expire after 30 minutes of inactivity or 8 hours total
            </p>
          </div>
        </div>
      )}
    </>
  );
}