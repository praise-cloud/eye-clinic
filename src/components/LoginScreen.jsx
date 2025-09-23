import React, { useState } from 'react'
import { EyeIcon, LoginIcon, UserPlusIcon } from './Icons'

const LoginScreen = ({ onLogin, onAddUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      try {
        await onLogin(formData.email, formData.password)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-xl">
            <EyeIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Eye Clinic account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LoginIcon className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Need to add a new team member?
            </p>
            <button
              onClick={onAddUser}
              className="btn btn-outline"
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Add New User
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Need help? Contact your system administrator
          </p>
        </div>

        {/* Demo Credentials (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Demo Credentials</h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>Doctor: doctor@clinic.com / password123</p>
              <p>Assistant: assistant@clinic.com / password123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginScreen