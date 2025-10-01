import React, { useState } from 'react'

const AdminForm = ({ formData, onChange }) => {
  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   phoneNumber: '',
  //   clinicName: '',
  //   clinicAddress: '',
  //   password: '',
  //   confirmPassword: ''
  // })

  // const onChange = (e) => {
  //   const { name, value } = e.target
  //   setFormData((prev) => ({ ...prev, [name]: value }))
  // }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-6 w-full"
    >
      {/* First & Last Name */}
      <div className="flex gap-4 w-full">
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="flex gap-4 w-full">
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      {/* Clinic Info */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Clinic Name</label>
        <input
          type="text"
          name="clinicName"
          value={formData.clinicName}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Clinic Address</label>
        <textarea
          name="clinicAddress"
          value={formData.clinicAddress}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows="3"
          required
        />
      </div>

      {/* Passwords */}
      <div className="flex gap-4 w-full">
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>


    </form>
  )
}

export default AdminForm
