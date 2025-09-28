export default function ProjectLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="w-32 h-9 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-80 h-9 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-64 h-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-24 h-9 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-9 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="w-36 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="w-36 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full animate-pulse mb-4"></div>
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
              <div className="w-80 h-4 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
              <div className="w-32 h-9 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}