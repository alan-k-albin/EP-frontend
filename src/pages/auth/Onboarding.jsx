import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { completeOnboarding } from '../../api/userAPI'
import API from '../../api/axios'

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
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState(user?.username || '')
  const [college, setCollege] = useState('')
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNextStep = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers and underscores')
      return
    }
    setError('')
    try {
      await API.put('/users/me/username', { username: username.trim() })
      updateUser({ username: username.trim() })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Username already taken. Try another.')
    }
  }

  const handleContinue = async () => {
    if (!selected) {
      setError('Please select one option to continue')
      return
    }
    setLoading(true)
    try {
      if (selected === 'student' && college.trim()) {
        await API.put('/users/me', { college: college.trim() })
      }
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
          {step === 1
            ? 'First, choose your username for EP.'
            : 'EP is built for everyone. Help us personalize your experience.'}
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      {step === 1 && (
        <div className="flex-1">
          <div className="mb-5">
            <p className="text-xs text-gray-400 font-medium mb-2">Username *</p>
            <input
              type="text"
              placeholder="e.g. alan_k"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              maxLength={30}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
            <p className="text-xs text-gray-400 mt-1.5">Letters, numbers and underscores only. Min 3 characters.</p>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-400 font-medium mb-2">College / University <span className="text-gray-300">(optional)</span></p>
            <input
              type="text"
              placeholder="e.g. IIT Bombay, MIT"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-400 font-medium mb-2">Signed in with Google as:</p>
            <div className="flex items-center gap-3">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                  {user?.fullName?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            disabled={!username.trim()}
            className="w-full bg-[#2B4593] text-white py-4 rounded-2xl font-bold text-sm disabled:opacity-40 hover:bg-[#8EB3E7] transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {step === 2 && (
        <>
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
            <button
              onClick={() => { setStep(1); setError('') }}
              className="w-full text-center text-sm text-gray-400 mt-3"
            >
              ← Back
            </button>
            <p className="text-center text-xs text-gray-300 mt-2">
              You can always change this later in settings
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Onboarding