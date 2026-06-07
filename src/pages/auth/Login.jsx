import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/authAPI'
import { useAuth } from '../../context/AuthContext'

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
    setLoading(true)
    setError('')
    try {
      const res = await loginUser({ email, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
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

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:border-[#2B4593]"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <p className="text-center text-sm text-[#2B4593] mt-3 cursor-pointer">
          Forgot password?
        </p>

      </div>
    </div>
  )
}

export default Login