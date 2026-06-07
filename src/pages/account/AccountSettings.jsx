import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'

function AccountSettings() {
  const [email, setEmail] = useState('alan@example.com')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <div className="min-h-screen bg-white">

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Account Settings</h1>
      </div>

      <div className="pt-16 px-4 pb-10">

        {/* Change Email */}
        <div className="py-5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-3">Change Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
          />
          <button className="mt-3 bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl">
            Update Email
          </button>
        </div>

        {/* Change Password */}
        <div className="py-5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-3">Change Password</p>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] mb-3"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] mb-3"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
          />
          <button className="mt-3 bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl">
            Update Password
          </button>
        </div>

        {/* Delete Account */}
        <div className="py-5">
          <p className="text-sm font-semibold text-gray-800 mb-1">Delete Account</p>
          <p className="text-xs text-gray-400 mb-3">This action is permanent and cannot be undone.</p>
          <button className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl">
            Delete My Account
          </button>
        </div>

      </div>
    </div>
  )
}

export default AccountSettings