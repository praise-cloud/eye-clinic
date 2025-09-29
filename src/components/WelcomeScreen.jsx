import React from 'react'
import { EyeIcon, UsersIcon, ChartIcon, DocumentIcon, ChatIcon, ArrowRightIcon } from './Icons'

const WelcomeScreen = ({ onGetStarted }) => {
  const features = [
    {
      icon: <UsersIcon className="w-8 h-8 text-blue-600" />,
      title: 'Patient Management',
      description: 'Comprehensive patient records and history'
    },
    {
      icon: <ChartIcon className="w-8 h-8 text-green-600" />,
      title: 'Visual Field Tests',
      description: 'Advanced test analysis and tracking'
    },
    {
      icon: <DocumentIcon className="w-8 h-8 text-purple-600" />,
      title: 'Reports & Analytics',
      description: 'Detailed insights and PDF reports'
    },
    {
      icon: <ChatIcon className="w-8 h-8 text-orange-600" />,
      title: 'Team Communication',
      description: 'Secure doctor-assistant messaging'
    }
  ]

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 shadow-2xl">
            <EyeIcon className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eye Clinic Management System
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional visual field test management for medical professionals.
            Streamline your clinic operations with comprehensive patient care tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            <span>Get Started</span>
            <ArrowRightIcon className="ml-3 w-6 h-6" />
          </button>

          <p className="mt-4 text-gray-500 text-sm">
            Set up your clinic in just a few simple steps
          </p>
        </div>

        {/* Bottom Features */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Setup Clinic</h4>
              <p className="text-sm text-gray-600">Configure your clinic information</p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Add Users</h4>
              <p className="text-sm text-gray-600">Create accounts for your team</p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Start Managing</h4>
              <p className="text-sm text-gray-600">Begin patient care operations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen