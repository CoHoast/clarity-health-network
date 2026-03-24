// TrueCare Admin UI Components
// Phase 1: Visual Foundation
// Phase 2: UX & Components

// Core Components
export { Card, CardHeader, CardFooter } from './Card';
export { StatCard, StatCardCompact } from './StatCard';
export { Badge, StatusBadge } from './Badge';
export { Button, IconButton } from './Button';
export { DataTable, TableHeader, TableCell } from './DataTable';
export { PageHeader, Tabs, PillTabs } from './PageHeader';
export { SearchInput, FilterSelect } from './SearchInput';

// Empty States
export { 
  EmptyState, 
  NoSearchResults, 
  NoProviders, 
  NoContracts, 
  NoTeamMembers, 
  NoData 
} from './EmptyState';

// Loading States (Phase 2)
export { 
  Skeleton, 
  TableRowSkeleton, 
  CardSkeleton, 
  StatCardSkeleton, 
  ListSkeleton, 
  PageSkeleton 
} from './Skeleton';

// Toast Notifications (Phase 2)
export { ToastProvider, useToast } from './Toast';

// Modals (Phase 2)
export { Modal, ConfirmModal, SuccessModal } from './Modal';

// Slide Over Panel (Phase 2)
export { 
  SlideOver, 
  FormSection, 
  FormField, 
  Input, 
  Textarea, 
  Select 
} from './SlideOver';

// Navigation (Phase 2)
export { Breadcrumb } from './Breadcrumb';

// Action Required Widget (Phase 9)
export { 
  ActionRequiredWidget, 
  createDemoActionItems,
  type ActionItem,
  type ActionPriority,
  type ActionCategory 
} from './ActionRequired';

// Command Palette (Phase 3)
export { CommandPalette } from './CommandPalette';

// Bulk Actions (Phase 8)
export { BulkActionBar, bulkActionCreators } from './BulkActionBar';

// Re-export design system tokens
export * from '../design-system';
