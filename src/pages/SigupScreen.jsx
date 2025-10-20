import React, { useState, useEffect } from 'react'
import AssistantForm from './forms/AssistantForm'
import DoctorForm from './forms/DoctorForm'
import AdminForm from './forms/AdminForm'

const SignupScreen = ({ selectedRole, onComplete, onBack }) => {
  const [formData, setFormData] = useState({})

  // Normalize role to proper title case (handles multi-word like 'clinic assistant' → 'Clinic Assistant')
  const normalizedRole = selectedRole
    ? selectedRole.replace(/\b\w/g, l => l.toUpperCase())
    : 'Unknown'

  // One-time log on mount/update
  useEffect(() => {
    console.log('Raw selectedRole:', selectedRole, 'Normalized:', normalizedRole);
  }, [selectedRole, normalizedRole]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const errors = []

    // Always required: Name, email, password match
    if (!formData.firstName || !formData.lastName) errors.push('First and Last Name are required')
    if (!formData.email || !formData.email.includes('@')) errors.push('Valid Email is required')
    if (!formData.password) errors.push('Password is required')
    if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match')

    // Role-specific required fields (use normalizedRole safely)
    const lowerRole = normalizedRole.toLowerCase()
    if (lowerRole === 'doctor' || lowerRole === 'clinic assistant') {
      // Clinical roles: Require gender, phone
      if (!formData.gender) errors.push('Gender is required')
      if (!formData.phoneNumber) errors.push('Phone Number is required')
    } else if (lowerRole === 'admin') {
      // Admin: Optional gender/phone; require permissions
      if (!formData.permissions) errors.push('Permissions are required (e.g., users,patients)')
    } else {
      console.warn('Fallback validation for unknown role:', normalizedRole)
    }

    if (errors.length > 0) {
      alert(errors.join('\n'))
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete({}, { role: normalizedRole, ...formData })
    }
  }

  const renderFormFields = () => {
    const lowerRole = normalizedRole.toLowerCase()  // Safe use
    switch (normalizedRole) {
      case 'Clinic Assistant':
        return <AssistantForm formData={formData} onChange={handleChange} />
      case 'Doctor':
        return <DoctorForm formData={formData} onChange={handleChange} />
      case 'Admin':
        return <AdminForm formData={formData} onChange={handleChange} />
      default:
        console.error('Render error: Unknown role', normalizedRole)  // Log for debug
        return <p>Invalid role: {normalizedRole}. Please go back and select again.</p>
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6 ">
      <div className="relative w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-12">
          Add {normalizedRole || 'User'}  {/* Fallback in JSX too */}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupScreen