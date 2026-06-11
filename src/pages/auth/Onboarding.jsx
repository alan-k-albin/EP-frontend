import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { completeOnboarding } from '../../api/userAPI'

const userTypes = [
  {
    value: 'public',
    emoji: '👋',
    label: 'Everyone',
    desc: 'Join EP as yourself. Your story matters here.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    value: 'student',
    emoji: '🎓',
    label: 'Student',
    desc: 'Currently studying at a school, college or university.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    value: 'professional',
    emoji: '💻',
    label: 'Developer & Tech Professional',
    desc: 'Programmer, engineer, designer or any tech professional.',
    color: 'from-green-500 to-teal-500',
  },
  {
    value: 'company',
    emoji: '🏢',
    label: 'Company',
    desc: 'Business, startup or organization building the future.',
    color: 'from-orange-500 to-red-500',
  },
]

function Onboarding() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = async () => {
    if (!selected) {
      setError('Please select one option to continue')
      return
    }
    setLoading(true)
    try {
      const res = await completeOnboarding({ userType: selected })
      updateUser({ userType: selected, onboardingCompleted: true, ...res.data })
      navigate('/')
    } catch (err) {
      console.error(err)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#2B4593] mb-4">EP</h1>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.fullName?.split(' ')[0]}! 👋
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
          EP is built for everyone. Help us personalize your experience by telling us a bit about yourself.
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <div className="space-y-3 flex-1">
        {userTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => { setSelected(type.value); setError('') }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
              selected === type.value
                ? 'border-[#2B4593] bg-[#2B4593]/5 shadow-sm'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center text-2xl flex-shrink-0`}>
              {type.emoji}
            </div>
            <div className="flex-1">
              <p className={`font-bold text-sm ${selected === type.value ? 'text-[#2B4593]' : 'text-gray-800'}`}>
                {type.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{type.desc}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selected === type.value ? 'border-[#2B4593]' : 'border-gray-300'
            }`}>
              {selected === type.value && (
                <div className="w-3 h-3 rounded-full bg-[#2B4593]" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleContinue}
          disabled={loading || !selected}
          className="w-full bg-[#2B4593] text-white py-4 rounded-2xl font-bold text-sm disabled:opacity-40 hover:bg-[#8EB3E7] transition-colors"
        >
          {loading ? 'Setting up your EP...' : 'Continue to EP →'}
        </button>
        <p className="text-center text-xs text-gray-300 mt-4">
          You can always change this later in settings
        </p>
      </div>
    </div>
  )
}

export default Onboarding