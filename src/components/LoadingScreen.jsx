import React from 'react'
import { LoadingIcon, EyeIcon } from './Icons'

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 shadow-xl">
          <EyeIcon className="w-10 h-10 text-white" />
        </div>

        {/* Loading Spinner */}
        <div className="mb-6">
          <LoadingIcon className="w-12 h-12 text-blue-600 mx-auto" />
        </div>

        {/* Loading Message */}
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          {message}
        </h2>

        <p className="text-gray-600 max-w-sm mx-auto">
          Please wait while we set up everything for you...
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen