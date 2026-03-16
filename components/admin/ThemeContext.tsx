"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  setIsDark: () => {},
});

export function ThemeProvider({ 
  children, 
  value 
}: { 
  children: ReactNode;
  value: ThemeContextType;
}) {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Stat card styles based on theme
export function useStatCardStyles() {
  const { isDark } = useTheme();
  
  return {
    // Main stat card container
    card: isDark 
      ? "bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-500/20"
      : "bg-gradient-to-br from-blue-900 to-slate-800 border border-blue-700/50",
    
    // Primary value text
    value: isDark ? "text-cyan-400" : "text-white",
    
    // Label text  
    label: isDark ? "text-slate-300" : "text-blue-100",
    
    // Icon container
    iconBox: isDark 
      ? "bg-cyan-500/20 border border-cyan-500/30"
      : "bg-blue-700/50 border border-blue-600/50",
    
    // Icon color
    icon: isDark ? "text-cyan-400" : "text-blue-200",
    
    // Change/trend badge - positive
    trendUp: isDark ? "text-cyan-400" : "text-green-300",
    
    // Change/trend badge - warning
    trendWarning: isDark ? "text-amber-400" : "text-amber-300",
  };
}
