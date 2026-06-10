import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

const userTypes = [
  { value: 'student', emoji: '🎓', label: 'Student', desc: 'Currently studying at a school, college or university' },
  { value: 'professional', emoji: '💼', label: 'Professional', desc: 'Working professional or job seeker' },
  { value: 'company', emoji: '🏢', label: 'Company', desc: 'Business, organization or institution' },
  { value: 'public', emoji: '👤', label: 'General Public', desc: 'Farmer, trader, artisan or anyone else' },
]

function Onboarding() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    setLoading(true)
    try {
      await API.put('/users/onboarding', {
        userType: selected || 'public',
        onboardingCompleted: true,
      })
      const token = localStorage.getItem('token')
      const res = await API.get('/auth/me')
      login(token, res.data)
      navigate('/')
    } catch (err) {
      console.error(err)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    try {
      await API.put('/users/onboarding', {
        userType: 'public',
        onboardingCompleted: true,
      })
    } catch (err) {
      console.error(err)
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#2B4593] mb-1">EP</h1>
        <h2 className="text-xl font-bold text-gray-800 mt-4">
          Welcome, {user?.fullName?.split(' ')[0]}! 👋
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          Help us personalize your experience
        </p>
      </div>

      <div className="space-y-3 flex-1">
        {userTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelected(type.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
              selected === type.value
                ? 'border-[#2B4593] bg-[#2B4593]/5'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <span className="text-3xl">{type.emoji}</span>
            <div>
              <p className={`font-semibold text-sm ${selected === type.value ? 'text-[#2B4593]' : 'text-gray-800'}`}>
                {type.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
            </div>
            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selected === type.value ? 'border-[#2B4593]' : 'border-gray-300'
            }`}>
              {selected === type.value && (
                <div className="w-3 h-3 rounded-full bg-[#2B4593]" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-[#2B4593] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-gray-400 text-sm py-2"
        >
          Skip for now →
        </button>
      </div>
    </div>
  )
}

export default Onboarding