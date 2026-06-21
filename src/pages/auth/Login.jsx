import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { loginUser, googleAuth } from '../../api/authAPI'
import { useAuth } from '../../context/AuthContext'

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await loginUser({ email, password })
      login(res.data.token, res.data.user)
      if (!res.data.user.onboardingCompleted) {
        navigate('/onboarding')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      const res = await googleAuth({ token: credentialResponse.credential })
      login(res.data.token, res.data.user)
      if (!res.data.user.onboardingCompleted) {
        navigate('/onboarding')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google Sign In failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-black text-[#2B4593] mb-2 tracking-tight">EP</h1>
      <p className="text-gray-500 mb-10 text-sm">Connect. Share. Grow.</p>

      <div className="w-full max-w-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Full width Google Button */}
        <div className="w-full mb-5 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign In failed. Please try again.')}
            width="368"
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKey}
          className={`w-full border rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:border-[#2B4593] ${
            email && !validateEmail(email) ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {email && !validateEmail(email) && (
          <p className="text-xs text-red-400 -mt-3 mb-3 ml-1">Enter a valid email address</p>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKey}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 text-sm focus:outline-none focus:border-[#2B4593]"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#2B4593] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#8EB3E7] transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2B4593] font-semibold">Sign up</Link>
        </p>

        <Link to="/forgot-password" className="block text-center text-sm text-[#2B4593] mt-3">
          Forgot password?
        </Link>
      </div>
    </div>
  )
}

export default Login