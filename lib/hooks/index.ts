// API hooks barrel file
export { useApi, api, setToken, clearToken, login, logout, isAuthenticated } from './useApi';

// Member hooks
export { 
  useMemberDashboard, 
  useMemberClaims, 
  useMemberBenefits, 
  useMemberIDCard,
  useMemberDocuments,
  useMemberMessages,
  useMemberProviders,
  useMemberAppointments,
  useMemberPrescriptions,
  submitCostEstimate,
  sendMessage as sendMemberMessage,
} from './useMember';

// Provider hooks
export {
  useProviderDashboard,
  useProviderProfile,
  useProviderClaims,
  useProviderPayments,
  useProviderContracts,
  useProviderCredentialing,
  useProviderLocations,
  useProviderFeeSchedule,
  useProviderPatients,
  useProviderMessages,
  checkEligibility,
  updateProfile,
  addLocation,
  sendMessage as sendProviderMessage,
} from './useProvider';

// Employer hooks
export {
  useEmployerDashboard,
  useEmployerRoster,
  useEmployerEmployee,
  useEmployerBilling,
  useEmployerAnalytics,
  useEmployerDocuments,
  useEmployerEnrollment,
  addEmployee,
  updateEmployee,
  terminateEmployee,
} from './useEmployer';

// Admin hooks
export {
  useAdminDashboard,
  useAdminClaims,
  useAdminClaim,
  useAdminProviders,
  useAdminMembers,
  useAdminFraudAlerts,
  useAdminPayments,
  useAdminAuditLogs,
  useAdminCredentialing,
  useAdminContracts,
  useAdminReports,
  useAdminNetwork,
  useAdminUsers,
  useAdminEmployers,
  useAdminFeeSchedules,
  adjudicateClaim,
  updateFraudAlert,
  createPaymentBatch,
} from './useAdmin';

// Pulse AI hooks
export { usePulse, pulsePrompts } from './usePulse';
