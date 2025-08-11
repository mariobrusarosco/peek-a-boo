'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error)
  }, [error])

  return (
    // global-error must include html and body tags
    <html lang="en">
      <body className="bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong!
            </h1>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. A critical error has occurred in the application.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            
            <a 
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Go to Homepage
            </a>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto text-red-600">
                {error.message}
                {error.stack && '\n\n' + error.stack}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  )
}