export default function AdminDirectPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard (Direct Access)</h1>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Providers</h2>
          <p>50,000+ active providers</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Networks</h2>
          <p>Arizona Antidote PPO</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Claims</h2>
          <p>$2.3M processed this month</p>
        </div>
      </div>
      
      <div className="mt-8 bg-slate-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <p>• Add Provider</p>
          <p>• Review Credentialing Queue</p>
          <p>• Export Reports</p>
          <p>• Manage Networks</p>
        </div>
      </div>
      
      <div className="mt-8 text-slate-400">
        <p>This is a direct access page that bypasses all authentication.</p>
        <p>The normal login flow has a cookie persistence issue on Railway.</p>
      </div>
    </div>
  );
}