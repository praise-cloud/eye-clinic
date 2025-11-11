import React from 'react'
import logo from '../assets/images/logo.png'

const SetupScreen = ({ onSelectRole }) => {
  const roles = ['Clinic Assistant', 'Doctor', 'Admin']

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6 overflow-hidden bg-gray-50 dark:bg-gray-900">

      {/* Full background logo */}
      <div className="absolute inset-0">
        <img
          src={logo}
          alt="Background Logo"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      {/* Background text close to logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none z-0">
        <div>
          <h1 className="text-6xl font-extrabold tracking-wide">KORENYE CLINIC</h1>
          <h2 className="text-3xl">NIG. LTD.</h2>
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-48 h-48" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Role</h1>
          <p className="text-gray-600 dark:text-gray-400">Let's set up your eye clinic management system</p>
        </div>

        {/* Role selection */}
        <div className="flex flex-col items-center mx-auto max-w-md space-y-5">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => onSelectRole(role)}
              className="flex justify-center items-center bg-primary-500 p-5 w-full text-white rounded-md text-lg transition-colors duration-200 hover:bg-primary-600"
            >
              {role}
            </button>
          ))}
        </div>

        {/* Help Text */}
        <div className="text-center mt-6 pt-10">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Reach out to our customer care
          </p>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen
