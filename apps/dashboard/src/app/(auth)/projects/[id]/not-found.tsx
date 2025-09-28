import Link from 'next/link';
import { Button } from '@/domains/ui-system/components/ui/button';

export default function ProjectNotFound() {
  return (
    <div className="container mx-auto py-6">
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-8v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The project you&apos;re looking for doesn&apos;t exist or may have been deleted.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button className="w-full sm:w-auto">
                  ← Back to Projects
                </Button>
              </Link>
              <Link href="/projects/optimistic">
                <Button variant="outline" className="w-full sm:w-auto">
                  Try Creating One
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              If you believe this is an error, please check the URL or{' '}
              <Link href="/projects" className="text-blue-600 hover:text-blue-700">
                browse all projects
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}