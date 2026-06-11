import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../api/authAPI'
import { useAuth } from '../../context/AuthContext'

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function Register() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    college: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async () => {
    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError('Please fill in all required fields')
      return
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await registerUser({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        college: form.college,
        password: form.password,
      })
      login(res.data.token, res.data.user)
      navigate('/onboarding')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-5xl font-black text-[#2B4593] mb-2 tracking-tight">EP</h1>
      <p className="text-gray-500 mb-8 text-sm">Create your account</p>

      <div className="w-full max-w-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {[
          { name: 'fullName', placeholder: 'Full Name', type: 'text' },
          { name: 'username', placeholder: 'Username (e.g. alan)', type: 'text' },
          { name: 'email', placeholder: 'Email', type: 'email' },
          { name: 'college', placeholder: 'College / University (optional)', type: 'text' },
          { name: 'password', placeholder: 'Password', type: 'password' },
          { name: 'confirmPassword', placeholder: 'Confirm Password', type: 'password' },
        ].map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:border-[#2B4593]"
          />
        ))}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-[#2B4593] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#8EB3E7] transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2B4593] font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register