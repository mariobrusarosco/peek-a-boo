export default function DashboardScreen() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            + Create Flag
          </button>
        </div>
      </div>

      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Flags</h3>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold">24</span>
            <span className="text-sm text-green-500">+2 this week</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Active Flags</h3>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold">18</span>
            <span className="text-sm text-green-500">+1 this week</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">SDK Requests</h3>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold">3.2k</span>
            <span className="text-sm text-green-500">+12% this week</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Environments</h3>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold">3</span>
            <span className="text-sm text-gray-500">No change</span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium mb-4">Flag Usage Over Time</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            [Chart Placeholder]
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium mb-4">Flags by Status</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            [Chart Placeholder]
          </div>
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium">Recent Flag Changes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Flag</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">new-checkout-flow</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Enabled in Production</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Alex Kim</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">10 minutes ago</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">dark-mode-v2</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Created</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Jamie Smith</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">2 hours ago</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">beta-analytics</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Updated targeting rules</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Taylor Wong</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Yesterday</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}