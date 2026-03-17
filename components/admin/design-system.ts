// TrueCare Admin Design System
// Phase 1: Visual Foundation

export const colors = {
  // Brand colors - refined, less saturated
  brand: {
    primary: '#0891b2',      // cyan-600
    primaryLight: '#22d3ee', // cyan-400
    primaryDark: '#0e7490',  // cyan-700
    secondary: '#0d9488',    // teal-600
    secondaryLight: '#2dd4bf', // teal-400
    secondaryDark: '#0f766e', // teal-700
  },
  
  // Status colors
  status: {
    success: '#10b981',      // emerald-500
    successLight: '#d1fae5', // emerald-100
    warning: '#f59e0b',      // amber-500
    warningLight: '#fef3c7', // amber-100
    error: '#ef4444',        // red-500
    errorLight: '#fee2e2',   // red-100
    info: '#3b82f6',         // blue-500
    infoLight: '#dbeafe',    // blue-100
  },
  
  // Dark theme
  dark: {
    bg: '#0f172a',           // slate-900
    bgElevated: '#1e293b',   // slate-800
    bgSubtle: '#334155',     // slate-700
    border: '#475569',       // slate-600
    borderSubtle: '#334155', // slate-700
    text: '#f8fafc',         // slate-50
    textMuted: '#94a3b8',    // slate-400
    textSubtle: '#64748b',   // slate-500
  },
  
  // Light theme
  light: {
    bg: '#f8fafc',           // slate-50
    bgElevated: '#ffffff',
    bgSubtle: '#f1f5f9',     // slate-100
    border: '#e2e8f0',       // slate-200
    borderSubtle: '#f1f5f9', // slate-100
    text: '#0f172a',         // slate-900
    textMuted: '#64748b',    // slate-500
    textSubtle: '#94a3b8',   // slate-400
  },
};

// Typography scale
export const typography = {
  // Font sizes with line heights
  h1: 'text-3xl font-bold tracking-tight',      // 30px
  h2: 'text-2xl font-semibold tracking-tight',  // 24px
  h3: 'text-xl font-semibold',                   // 20px
  h4: 'text-lg font-semibold',                   // 18px
  h5: 'text-base font-semibold',                 // 16px
  body: 'text-sm',                               // 14px
  bodySmall: 'text-xs',                          // 12px
  label: 'text-xs font-medium uppercase tracking-wider',
  mono: 'font-mono text-sm',
};

// Spacing scale
export const spacing = {
  card: 'p-6',
  cardCompact: 'p-4',
  section: 'space-y-6',
  sectionLarge: 'space-y-8',
  grid: 'gap-6',
  gridCompact: 'gap-4',
};

// Border radius
export const radius = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
};

// Shadows - subtle, professional
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  // Custom shadow for cards
  card: 'shadow-[0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1)]',
  cardHover: 'shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1),0_2px_4px_-2px_rgb(0_0_0/0.1)]',
};

// Transitions
export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  base: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
};

// Theme-aware class generators
export const getThemeClasses = (isDark: boolean) => ({
  // Backgrounds
  bg: isDark ? 'bg-slate-900' : 'bg-slate-50',
  bgElevated: isDark ? 'bg-slate-800' : 'bg-white',
  bgSubtle: isDark ? 'bg-slate-800/50' : 'bg-slate-50',
  bgHover: isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100',
  
  // Borders
  border: isDark ? 'border-slate-700' : 'border-slate-200',
  borderSubtle: isDark ? 'border-slate-700/50' : 'border-slate-100',
  
  // Text
  text: isDark ? 'text-white' : 'text-slate-900',
  textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
  textSubtle: isDark ? 'text-slate-500' : 'text-slate-400',
  
  // Cards
  card: isDark 
    ? 'bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm' 
    : 'bg-white border border-slate-200/80 shadow-sm',
  cardHover: isDark
    ? 'hover:bg-slate-800 hover:border-slate-600'
    : 'hover:shadow-md hover:border-slate-300',
  
  // Inputs
  input: isDark
    ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20',
  
  // Tables
  tableHeader: isDark ? 'bg-slate-800/50' : 'bg-slate-50',
  tableRow: isDark ? 'border-slate-700/50' : 'border-slate-100',
  tableRowHover: isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50',
  
  // Stat cards (dark gradient style)
  statCard: isDark
    ? 'bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50'
    : 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/30',
});

// Button variants
export const buttonVariants = {
  primary: 'bg-cyan-600 hover:bg-cyan-700 text-white font-medium',
  secondary: 'bg-teal-600 hover:bg-teal-700 text-white font-medium',
  outline: (isDark: boolean) => isDark
    ? 'border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white'
    : 'border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  ghost: (isDark: boolean) => isDark
    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-medium',
};

// Badge variants
export const badgeVariants = {
  default: (isDark: boolean) => isDark
    ? 'bg-slate-700 text-slate-300'
    : 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-500 border border-amber-500/30',
  error: 'bg-red-500/20 text-red-500 border border-red-500/30',
  info: 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30',
  primary: 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30',
};
