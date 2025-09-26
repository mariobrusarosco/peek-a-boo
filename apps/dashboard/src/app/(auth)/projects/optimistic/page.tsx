import { Suspense } from 'react';
import { fetchProjects } from '@/domains/projects/services/project.service';
import OptimisticProjectList from '@/domains/projects/components/project-list/optimistic-project-list';
import Link from 'next/link';
import { Button } from '@/domains/ui-system/components/ui/button';

// ✅ Server Component that fetches data
export default async function OptimisticProjectsPage() {
  // Server-side data fetching
  const initialProjects = await fetchProjects();

  return (
    <div className="container mx-auto py-6">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="outline" size="sm">
            ← Back to Regular Projects
          </Button>
        </Link>
      </div>

      {/* React 19 Optimistic Updates Demo */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          React 19 + Server Actions Demo
        </h1>
        <p className="text-gray-700 mb-4">
          Experience the power of <code className="bg-blue-100 px-2 py-1 rounded text-sm">useOptimistic</code> + 
          <code className="bg-purple-100 px-2 py-1 rounded text-sm ml-1">useActionState</code>
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">🚀 What You'll See:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Projects appear instantly (no waiting)</li>
              <li>• Visual optimistic state indicators</li>
              <li>• Server confirmation reconciliation</li>
              <li>• Automatic error rollback</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-purple-800 mb-2">🎯 Technical Benefits:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• 0ms perceived latency</li>
              <li>• Progressive enhancement</li>
              <li>• Built-in error boundaries</li>
              <li>• Automatic cache invalidation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* The main demo component */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <OptimisticProjectList initialProjects={initialProjects} />
      </Suspense>

      {/* Code examples */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Key Code Patterns</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">1. useOptimistic Hook</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`const [optimisticProjects, addOptimisticProject] = useOptimistic(
  initialProjects,
  (state, newProject) => [...state, newProject]
);`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">2. Server Action with useActionState</h3>
            <pre className="bg-gray-800 text-blue-400 p-3 rounded text-sm overflow-x-auto">
{`const [state, formAction, isPending] = useActionState(
  createProjectAction,
  null
);`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">3. Optimistic Form Action</h3>
            <pre className="bg-gray-800 text-yellow-400 p-3 rounded text-sm overflow-x-auto">
{`const optimisticFormAction = async (formData) => {
  // Instant UI update
  addOptimisticProject(tempProject);
  
  // Then run server action
  await formAction(formData);
};`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}