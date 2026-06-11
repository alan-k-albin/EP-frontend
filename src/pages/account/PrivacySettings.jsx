import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import { getMyProfile, updatePrivacy } from '../../api/userAPI'

function PrivacySettings() {
  const [privateAccount, setPrivateAccount] = useState(false)
  const [whoCanMessage, setWhoCanMessage] = useState('everyone')
  const [whoCanConnect, setWhoCanConnect] = useState('everyone')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setPrivateAccount(res.data.isPrivate || false)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePrivacy({ isPrivate: privateAccount, whoCanMessage, whoCanConnect })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center justify-between">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Privacy Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-1.5 rounded-full disabled:opacity-50"
        >
          {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="pt-16 px-4 pb-10">

        {/* Private Account */}
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <p className="text-sm font-semibold text-gray-800">Private Account</p>
            <p className="text-xs text-gray-400 mt-0.5">Only approved followers can see your posts and profile</p>
          </div>
          <button
            onClick={() => setPrivateAccount(!privateAccount)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${privateAccount ? 'bg-[#2B4593]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${privateAccount ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Who can message */}
        <div className="py-5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-1">Who can message you</p>
          <p className="text-xs text-gray-400 mb-4">Control who can send you direct messages</p>
          {['everyone', 'connections', 'nobody'].map((option) => (
            <button key={option} onClick={() => setWhoCanMessage(option)} className="flex items-center gap-3 w-full py-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${whoCanMessage === option ? 'border-[#2B4593]' : 'border-gray-300'}`}>
                {whoCanMessage === option && <div className="w-2.5 h-2.5 rounded-full bg-[#2B4593]" />}
              </div>
              <p className="text-sm text-gray-700 capitalize">{option}</p>
            </button>
          ))}
        </div>

        {/* Who can connect */}
        <div className="py-5">
          <p className="text-sm font-semibold text-gray-800 mb-1">Who can send you connection requests</p>
          <p className="text-xs text-gray-400 mb-4">Control who can connect with you on EP</p>
          {['everyone', 'connections of connections', 'nobody'].map((option) => (
            <button key={option} onClick={() => setWhoCanConnect(option)} className="flex items-center gap-3 w-full py-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${whoCanConnect === option ? 'border-[#2B4593]' : 'border-gray-300'}`}>
                {whoCanConnect === option && <div className="w-2.5 h-2.5 rounded-full bg-[#2B4593]" />}
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