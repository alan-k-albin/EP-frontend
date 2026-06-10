import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import { getMyProfile, updatePrivacy } from '../../api/userAPI'

function PrivacySettings() {
  const [privateAccount, setPrivateAccount] = useState(false)
  const [whoCanMessage, setWhoCanMessage] = useState('everyone')
  const [whoCanConnect, setWhoCanConnect] = useState('everyone')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getMyProfile().then((res) => {
      setPrivateAccount(res.data.isPrivate || false)
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      await updatePrivacy({
        isPrivate: privateAccount,
        whoCanMessage,
        whoCanConnect,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center justify-between">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Privacy Settings</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-1.5 rounded-full disabled:opacity-50"
        >
          {saved ? 'Saved!' : loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="pt-16 px-4 pb-10">

        {/* Private Account */}
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">Private Account</p>
            <p className="text-xs text-gray-400 mt-0.5">Only approved followers can see your posts</p>
          </div>
          <button
            onClick={() => setPrivateAccount(!privateAccount)}
            className={`w-12 h-6 rounded-full transition-colors relative ${privateAccount ? 'bg-[#2B4593]' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${privateAccount ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Who can message */}
        <div className="py-5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-3">Who can message you</p>
          {['everyone', 'connections', 'nobody'].map((option) => (
            <button key={option} onClick={() => setWhoCanMessage(option)} className="flex items-center gap-3 w-full py-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${whoCanMessage === option ? 'border-[#2B4593]' : 'border-gray-300'}`}>
                {whoCanMessage === option && <div className="w-2 h-2 rounded-full bg-[#2B4593]" />}
              </div>
              <p className="text-sm text-gray-700 capitalize">{option}</p>
            </button>
          ))}
        </div>

        {/* Who can connect */}
        <div className="py-5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-3">Who can send you connection requests</p>
          {['everyone', 'connections of connections', 'nobody'].map((option) => (
            <button key={option} onClick={() => setWhoCanConnect(option)} className="flex items-center gap-3 w-full py-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${whoCanConnect === option ? 'border-[#2B4593]' : 'border-gray-300'}`}>
                {whoCanConnect === option && <div className="w-2 h-2 rounded-full bg-[#2B4593]" />}
              </div>
              <p className="text-sm text-gray-700 capitalize">{option}</p>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default PrivacySettings