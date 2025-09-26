export default function DashboardScreen() {
  return (
    <div data-ui="dashboard-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            + Create Flag
          </button>
        </div>
      </div>
   </div>
  );
}