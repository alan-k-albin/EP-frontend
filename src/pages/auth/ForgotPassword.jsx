import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/forgot-password', { email })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-black text-[#2B4593] mb-2 tracking-tight">EP</h1>
      <p className="text-gray-500 mb-10 text-sm">Reset your password</p>

      {submitted ? (
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="font-bold text-gray-800 mb-2">Check your email</h2>
          <p className="text-sm text-gray-400 mb-6">
            We've sent a password reset link to {email}
          </p>
          <Link to="/login" className="text-[#2B4593] font-semibold text-sm">
            Back to Login
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          <p className="text-sm text-gray-500 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 text-sm focus:outline-none focus:border-[#2B4593]"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#2B4593] text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <Link to="/login" className="block text-center text-sm text-gray-400 mt-4">
            Back to Login
          </Link>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword