'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Root Error:', error)
  }, [error])

  // Check if it's a network/API error
  const isNetworkError = error.message.includes('fetch failed') || 
                        error.message.includes('ECONNREFUSED') ||
                        error.message.includes('Failed to fetch')

  const isAPIError = error.message.includes('API') || 
                    error.message.includes('projects') ||
                    error.message.includes('SDK service')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg bg-white p-8 rounded-lg shadow-lg">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
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

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isNetworkError ? 'Connection Error' : 
           isAPIError ? 'Service Unavailable' : 
           'Something went wrong'}
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 mb-6">
          {isNetworkError ? 
            'Unable to connect to our services. Please check your internet connection.' :
           isAPIError ? 
            'Our backend service is currently unavailable. We\'re working to resolve this.' :
            'An unexpected error occurred. Our team has been notified.'}
        </p>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              Development Error Details:
            </h3>
            <p className="text-sm text-red-700 font-mono">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-1">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Try again
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Link 
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-center"
            >
              Go Home
            </Link>
            <Link 
              href="/dashboard"
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-center"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-sm text-gray-500">
          {isNetworkError && (
            <p>If the problem persists, please check your network connection and try again.</p>
          )}
          {isAPIError && (
            <p>If the issue continues, our services may be temporarily down. Please try again in a few minutes.</p>
          )}
          {!isNetworkError && !isAPIError && (
            <p>If you continue to see this error, please contact support.</p>
          )}
        </div>
      </div>
    </div>
  )
}