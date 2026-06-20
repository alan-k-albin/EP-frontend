import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiEye, HiEyeOff } from 'react-icons/hi'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validatePassword = (password) => {
  const hasMin = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  return { hasMin, hasUpper, hasNumber, hasSpecial, valid: hasMin && hasUpper && hasNumber && hasSpecial }
}

function AccountSettings() {
  const { logout, updateUser } = useAuth()
  const navigate = useNavigate()

  // Username
  const [username, setUsername] = useState('')
  const [usernameMsg, setUsernameMsg] = useState('')
  const [usernameLoading, setUsernameLoading] = useState(false)

  // Email
  const [email, setEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState('')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const passwordStrength = validatePassword(newPassword)

  const handleChangeUsername = async () => {
    if (!username.trim()) {
      setUsernameMsg('❌ Please enter a username')
      return
    }
    if (username.length < 3) {
      setUsernameMsg('❌ Username must be at least 3 characters')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameMsg('❌ Username can only contain letters, numbers and underscores')
      return
    }
    setUsernameLoading(true)
    try {
      await API.put('/users/me/username', { username: username.trim() })
      updateUser({ username: username.trim() })
      setUsernameMsg('✅ Username updated successfully!')
      setUsername('')
    } catch (err) {
      setUsernameMsg(err.response?.data?.message || '❌ Failed to update username')
    } finally {
      setUsernameLoading(false)
    }
  }

  const handleChangeEmail = async () => {
    if (!validateEmail(email)) {
      setEmailMsg('Please enter a valid email address')
      return
    }
    try {
      await API.put('/auth/change-email', { email })
      setEmailMsg('✅ Email updated successfully!')
      setEmail('')
    } catch (err) {
      setEmailMsg(err.response?.data?.message || '❌ Failed to update email')
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setPasswordMsg('❌ Please enter your current password')
      return
    }
    if (!passwordStrength.valid) {
      setPasswordMsg('❌ New password does not meet requirements')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('❌ Passwords do not match')
      return
    }
    try {
      await API.put('/auth/change-password', { currentPassword, newPassword })
      setPasswordMsg('✅ Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || '❌ Failed to change password')
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

        {/* Change Username */}
        <div className="py-5 border-b border-gray-100">
          <p className="font-semibold text-gray-800 mb-1">Change Username</p>
          <p className="text-xs text-gray-400 mb-3">Letters, numbers and underscores only. Min 6 characters.</p>
          {usernameMsg && (
            <p className={`text-sm mb-6 ${usernameMsg.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
              {usernameMsg}
            </p>
          )}
          <input
            type="text"
            placeholder="New username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setUsernameMsg('') }}
            maxLength={30}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] mb-3"
          />
          <button
            onClick={handleChangeUsername}
            disabled={!username.trim() || usernameLoading}
            className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50"
          >
            {usernameLoading ? 'Updating...' : 'Update Username'}
          </button>
        </div>

        {/* Change Email */}
        <div className="py-5 border-b border-gray-100">
          <p className="font-semibold text-gray-800 mb-3">Change Email</p>
          {emailMsg && (
            <p className={`text-sm mb-3 ${emailMsg.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
              {emailMsg}
            </p>
          )}
          <input
            type="email"
            placeholder="New email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none mb-3 ${
              email && !validateEmail(email) ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#2B4593]'
            }`}
          />
          {email && !validateEmail(email) && (
            <p className="text-xs text-red-400 -mt-2 mb-3">Please enter a valid email address</p>
          )}
          <button
            onClick={handleChangeEmail}
            disabled={!email || !validateEmail(email)}
            className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50"
          >
            Update Email
          </button>
        </div>

        {/* Change Password */}
        <div className="py-5 border-b border-gray-100">
          <p className="font-semibold text-gray-800 mb-3">Change Password</p>
          {passwordMsg && (
            <p className={`text-sm mb-3 ${passwordMsg.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
              {passwordMsg}
            </p>
          )}

          <div className="relative mb-3">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] pr-12"
            />
            <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-3.5 text-gray-400">
              {showCurrent ? <HiEyeOff size={18} /> : <HiEye size={18} />}
            </button>
          </div>

          <div className="relative mb-3">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] pr-12"
            />
            <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-3.5 text-gray-400">
              {showNew ? <HiEyeOff size={18} /> : <HiEye size={18} />}
            </button>
          </div>

          {newPassword && (
            <div className="mb-3 space-y-1">
              {[
                { check: passwordStrength.hasMin, label: 'At least 8 characters' },
                { check: passwordStrength.hasUpper, label: 'At least one uppercase letter' },
                { check: passwordStrength.hasNumber, label: 'At least one number' },
                { check: passwordStrength.hasSpecial, label: 'At least one special character' },
              ].map((item) => (
                <p key={item.label} className={`text-xs flex items-center gap-1 ${item.check ? 'text-green-500' : 'text-gray-400'}`}>
                  {item.check ? '✓' : '○'} {item.label}
                </p>
              ))}
            </div>
          )}

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none mb-3 ${
              confirmPassword && newPassword !== confirmPassword ? 'border-red-300' : 'border-gray-200 focus:border-[#2B4593]'
            }`}
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-400 -mt-2 mb-3">Passwords do not match</p>
          )}

          <button
            onClick={handleChangePassword}
            disabled={!passwordStrength.valid || newPassword !== confirmPassword || !currentPassword}
            className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50"
          >
            Change Password
          </button>
        </div>

        {/* Delete Account */}
        <div className="py-5">
          <p className="font-semibold text-gray-800 mb-1">Delete Account</p>
          <p className="text-xs text-gray-400 mb-3">This action is permanent and cannot be undone.</p>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)} className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl">
              Delete My Account
            </button>
          ) : (
            <div>
              <p className="text-sm text-red-500 font-semibold mb-3">Are you absolutely sure? This cannot be undone!</p>
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} className="flex-1 bg-red-500 text-white text-sm font-semibold py-2 rounded-xl">
                  Yes, Delete Forever
                </button>
                <button onClick={() => setDeleteConfirm(false)} className="flex-1 border border-gray-200 text-gray-500 text-sm font-semibold py-2 rounded-xl">
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