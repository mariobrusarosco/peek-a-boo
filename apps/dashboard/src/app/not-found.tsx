import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Peek-a-boo',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
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
                strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-9a9 9 0 110 18 9 9 0 010-18z" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Homepage
          </Link>
          
          <div className="text-sm">
            <Link 
              href="/projects"
              className="text-blue-600 hover:text-blue-800 underline mx-2"
            >
              View Projects
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 underline mx-2"
            >
              Dashboard
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              href="/flags"
              className="text-blue-600 hover:text-blue-800 underline mx-2"
            >
              Feature Flags
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-xs text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  )
}