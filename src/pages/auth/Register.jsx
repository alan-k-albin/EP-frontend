import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../../api/authAPI'
import { useAuth } from '../../context/AuthContext'

function Register() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      const res = await googleAuth({ token: credentialResponse.credential })
      login(res.data.accessToken, res.data.refreshToken, res.data.user)
      if (!res.data.user.onboardingCompleted) {
        navigate('/onboarding')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google Sign Up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-5xl font-black text-[#2B4593] mb-2 tracking-tight">EP</h1>
      <p className="text-gray-500 mb-10 text-sm">Create your account</p>

      <div className="w-full max-w-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-[#2B4593] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-sm text-gray-500">Signing you in...</span>
          </div>
        ) : (
          <>
            <div className="w-full mb-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign Up failed. Please try again.')}
                width="368"
                text="signup_with"
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>
            <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed px-4">
              We use Google to ensure real accounts only.
              No fake emails allowed on EP.
            </p>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2B4593] font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register