import { Building2, Users, Shield, DollarSign, BarChart3, FileText } from "lucide-react";

export default function AdminV2Page() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1.5 text-base text-slate-600">PPO Network Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">50,000+</p>
              <p className="text-sm text-gray-600">Active Providers</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">2.5M</p>
              <p className="text-sm text-gray-600">Covered Members</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">$4.2M</p>
              <p className="text-sm text-gray-600">Monthly Claims</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">99.8%</p>
              <p className="text-sm text-gray-600">Compliance Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-medium">Add New Provider</p>
              <p className="text-sm text-gray-500">Onboard healthcare providers</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-medium">Review Credentialing</p>
              <p className="text-sm text-gray-500">5 pending applications</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-medium">Generate Reports</p>
              <p className="text-sm text-gray-500">Network analytics</p>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Network Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Arizona Antidote PPO</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Coverage Area</span>
              <span className="text-sm font-medium">Statewide</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Provider Count</span>
              <span className="text-sm font-medium">12,847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Specialties</span>
              <span className="text-sm font-medium">147</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">New Provider Application</p>
                <p className="text-xs text-gray-500">Dr. Sarah Chen - Cardiology</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Contract Renewed</p>
                <p className="text-xs text-gray-500">Phoenix Medical Group</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Credential Expiring</p>
                <p className="text-xs text-gray-500">15 providers - 30 days</p>
                <p className="text-xs text-gray-400 mt-1">Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protected Data Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Protected Healthcare Information</p>
            <p className="text-sm text-blue-700">This dashboard contains PHI/PII. All access is logged and monitored for HIPAA compliance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}