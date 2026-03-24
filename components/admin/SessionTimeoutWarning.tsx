"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogOut, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  SESSION_CONFIG, 
  getSession, 
  updateActivity, 
  clearSession, 
  shouldShowTimeoutWarning,
  getRemainingMinutes,
} from "@/lib/security/session";
import { Button } from "@/components/admin/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Session Timeout Warning Component
 * 
 * Shows a warning modal when session is about to expire.
 * Allows user to extend session or logout.
 */
export function SessionTimeoutWarning() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Check session status periodically
  useEffect(() => {
    const checkSession = () => {
      const session = getSession();
      
      if (!session) {
        // Session expired or doesn't exist
        handleLogout();
        return;
      }
      
      const remaining = session.expiresAt - Date.now();
      const minutes = Math.floor(remaining / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
      
      setRemainingMinutes(minutes);
      setRemainingSeconds(seconds);
      
      // Show warning when close to expiry
      if (shouldShowTimeoutWarning()) {
        setShowWarning(true);
      }
      
      // Auto-logout when expired
      if (remaining <= 0) {
        handleLogout();
      }
    };
    
    // Check immediately
    checkSession();
    
    // Then check every second when warning is shown, otherwise every 30 seconds
    const interval = setInterval(checkSession, showWarning ? 1000 : 30000);
    
    return () => clearInterval(interval);
  }, [showWarning]);

  // Track user activity to extend session
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateActivity();
      if (showWarning) {
        // If warning was showing and user interacted, check if we should hide it
        if (!shouldShowTimeoutWarning()) {
          setShowWarning(false);
        }
      }
    };
    
    // Throttle activity updates to once per minute
    let lastUpdate = 0;
    const throttledHandler = () => {
      const now = Date.now();
      if (now - lastUpdate > 60000) {
        lastUpdate = now;
        handleActivity();
      }
    };
    
    events.forEach(event => {
      window.addEventListener(event, throttledHandler, { passive: true });
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledHandler);
      });
    };
  }, [showWarning]);

  const handleExtendSession = useCallback(() => {
    updateActivity();
    setShowWarning(false);
  }, []);

  const handleLogout = useCallback(() => {
    clearSession();
    router.push('/login?reason=timeout');
  }, [router]);

  return (
    <AnimatePresence>
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl"
          >
            <div className="p-6 text-center">
              {/* Icon with countdown */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                {/* Countdown ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-amber-500/20"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={226}
                    strokeDashoffset={226 * (1 - (remainingMinutes * 60 + remainingSeconds) / (SESSION_CONFIG.WARNING_MINUTES * 60))}
                    className="text-amber-500 transition-all duration-1000"
                  />
                </svg>
              </div>
              
              {/* Title */}
              <h2 className="text-xl font-semibold text-white mb-2">
                Session Expiring Soon
              </h2>
              
              {/* Countdown */}
              <p className="text-slate-400 mb-2">
                Your session will expire in
              </p>
              <p className="text-3xl font-mono font-bold text-amber-500 mb-4">
                {String(remainingMinutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
              </p>
              
              {/* Message */}
              <p className="text-sm text-slate-500 mb-6">
                Click "Stay Logged In" to continue your session, or you'll be automatically logged out.
              </p>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleLogout}
                  icon={<LogOut className="w-4 h-4" />}
                >
                  Logout
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleExtendSession}
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Stay Logged In
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to check if session is valid
 */
export function useSession() {
  const [isValid, setIsValid] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const check = () => {
      const session = getSession();
      setIsValid(!!session);
      
      if (!session) {
        router.push('/login?reason=expired');
      }
    };
    
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [router]);
  
  return { isValid, extendSession: updateActivity };
}
