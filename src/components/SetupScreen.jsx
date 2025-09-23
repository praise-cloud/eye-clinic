import React, { useState } from 'react'
import { EyeIcon, ArrowRightIcon, ArrowLeftIcon, CheckIcon } from './Icons'

const SetupScreen = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Clinic Info
    clinicName: '',
    clinicAddress: '',
    clinicPhone: '',
    // Admin User
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: '',
    adminRole: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!formData.clinicName.trim()) {
      newErrors.clinicName = 'Clinic name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    
    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Name is required'
    }
    
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Email is invalid'
    }
    
    if (!formData.adminPassword) {
      newErrors.adminPassword = 'Password is required'
    } else if (formData.adminPassword.length < 6) {
      newErrors.adminPassword = 'Password must be at least 6 characters'
    }
    
    if (formData.adminPassword !== formData.adminPasswordConfirm) {
      newErrors.adminPasswordConfirm = 'Passwords do not match'
    }
    
    if (!formData.adminRole) {
      newErrors.adminRole = 'Role is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(1)
  }

  const handleComplete = () => {
    if (validateStep2()) {
      const clinicData = {
        name: formData.clinicName,
        address: formData.clinicAddress,
        phone: formData.clinicPhone
      }
      
      const adminData = {
        name: formData.adminName,
        email: formData.adminEmail,
        password: formData.adminPassword,
        role: formData.adminRole
      }
      
      onComplete(clinicData, adminData)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <EyeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinic Setup</h1>
          <p className="text-gray-600">Let's set up your eye clinic management system</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > 1 ? <CheckIcon className="w-6 h-6" /> : '1'}
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Clinic Info</span>
              </div>
              
              {/* Connector */}
              <div className="w-16 h-1 bg-gray-200 rounded">
                <div className={`h-full bg-blue-600 rounded transition-all duration-500 ${
                  currentStep > 1 ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Admin Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 animate-fade-in">
          {currentStep === 1 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Clinic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name *
                  </label>
                  <input
                    id="clinicName"
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => handleInputChange('clinicName', e.target.value)}
                    className={`input ${errors.clinicName ? 'input-error' : ''}`}
                    placeholder="Enter your clinic name"
                  />
                  {errors.clinicName && (
                    <p className="mt-1 text-sm text-red-600">{errors.clinicName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="clinicAddress"
                    rows={3}
                    value={formData.clinicAddress}
                    onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                    className="input resize-none"
                    placeholder="Enter clinic address"
                  />
                </div>

                <div>
                  <label htmlFor="clinicPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="clinicPhone"
                    type="tel"
                    value={formData.clinicPhone}
                    onChange={(e) => handleInputChange('clinicPhone', e.target.value)}
                    className="input"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={onBack}
                  className="btn btn-outline"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="btn btn-primary"
                >
                  Next
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Administrator Account</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="adminName"
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                    className={`input ${errors.adminName ? 'input-error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.adminName && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    className={`input ${errors.adminEmail ? 'input-error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.adminEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="adminPassword"
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                    className={`input ${errors.adminPassword ? 'input-error' : ''}`}
                    placeholder="Create a strong password"
                  />
                  {errors.adminPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adminPasswordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="adminPasswordConfirm"
                    type="password"
                    value={formData.adminPasswordConfirm}
                    onChange={(e) => handleInputChange('adminPasswordConfirm', e.target.value)}
                    className={`input ${errors.adminPasswordConfirm ? 'input-error' : ''}`}
                    placeholder="Confirm your password"
                  />
                  {errors.adminPasswordConfirm && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminPasswordConfirm}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adminRole" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role *
                  </label>
                  <select
                    id="adminRole"
                    value={formData.adminRole}
                    onChange={(e) => handleInputChange('adminRole', e.target.value)}
                    className={`input ${errors.adminRole ? 'input-error' : ''}`}
                  >
                    <option value="">Select your role</option>
                    <option value="doctor">Doctor</option>
                    <option value="assistant">Clinic Assistant</option>
                  </select>
                  {errors.adminRole && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminRole}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevStep}
                  className="btn btn-outline"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="btn btn-primary"
                >
                  Complete Setup
                  <CheckIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? All fields marked with * are required
          </p>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen