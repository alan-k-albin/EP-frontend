import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

function AccountSettings() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleChangeEmail = async () => {
    if (!email.trim()) return
    try {
      await API.put('/auth/change-email', { email })
      setEmailMsg('Email updated successfully!')
      setEmail('')
    } catch (err) {
      setEmailMsg(err.response?.data?.message || 'Failed to update email')
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match')
      return
    }
    try {
      await API.put('/auth/change-password', { currentPassword, newPassword })
      setPasswordMsg('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || 'Failed to change password')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await API.delete('/auth/delete-account')
      logout()
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Account Settings</h1>
      </div>

      <div className="pt-16 px-4 pb-10">

        {/* Change Email */}
        <div className="py-5 border-b border-gray-100">
          <p className="font-semibold text-gray-800 mb-3">Change Email</p>
          {emailMsg && <p className={`text-sm mb-3 ${emailMsg.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{emailMsg}</p>}
          <input
            type="email"
            placeholder="New email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] mb-3"
          />
          <button onClick={handleChangeEmail} className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl">
            Update Email
          </button>
        </div>

        {/* Change Password */}
        <div className="py-5 border-b border-gray-100">
          <p className="font-semibold text-gray-800 mb-3">Change Password</p>
          {passwordMsg && <p className={`text-sm mb-3 ${passwordMsg.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{passwordMsg}</p>}
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
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] mb-3"
          />
          <button onClick={handleChangePassword} className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl">
            Change Password
          </button>
        </div>

        {/* Delete Account */}
        <div className="py-5">
          <p className="font-semibold text-gray-800 mb-1">Delete Account</p>
          <p className="text-xs text-gray-400 mb-3">This action is permanent and cannot be undone.</p>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl"
            >
              Delete My Account
            </button>
          ) : (
            <div>
              <p className="text-sm text-red-500 font-semibold mb-3">Are you sure? This cannot be undone!</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="border border-gray-200 text-gray-500 text-sm font-semibold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountSettings