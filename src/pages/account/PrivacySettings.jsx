import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'

function PrivacySettings() {
  const [privateAccount, setPrivateAccount] = useState(false)
  const [whoCanMessage, setWhoCanMessage] = useState('connections')
  const [whoCanConnect, setWhoCanConnect] = useState('everyone')
  const [whoCanSeePosts, setWhoCanSeePosts] = useState('everyone')

  return (
    <div className="min-h-screen bg-white">

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Privacy Settings</h1>
      </div>

      <div className="pt-16 px-4 pb-10">

        {/* Private Account Toggle */}
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">Private Account</p>
            <p className="text-xs text-gray-400 mt-0.5">Only approved followers can see your posts</p>
          </div>
          <button
            onClick={() => setPrivateAccount(!privateAccount)}
            className={`w-12 h-6 rounded-full transition-colors ${privateAccount ? 'bg-[#2B4593]' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${privateAccount ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Who can message */}
        <div className="py-5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-3">Who can message you</p>
          {['everyone', 'connections', 'nobody'].map((option) => (
            <button
              key={option}
              onClick={() => setWhoCanMessage(option)}
              className={`flex items-center gap-3 w-full py-2`}
            >
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
            <button
              key={option}
              onClick={() => setWhoCanConnect(option)}
              className={`flex items-center gap-3 w-full py-2`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${whoCanConnect === option ? 'border-[#2B4593]' : 'border-gray-300'}`}>
                {whoCanConnect === option && <div className="w-2 h-2 rounded-full bg-[#2B4593]" />}
              </div>
              <p className="text-sm text-gray-700 capitalize">{option}</p>
            </button>
          ))}
        </div>

        {/* Who can see posts */}
        <div className="py-5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-3">Who can see your posts</p>
          {['everyone', 'connections', 'only me'].map((option) => (
            <button
              key={option}
              onClick={() => setWhoCanSeePosts(option)}
              className={`flex items-center gap-3 w-full py-2`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${whoCanSeePosts === option ? 'border-[#2B4593]' : 'border-gray-300'}`}>
                {whoCanSeePosts === option && <div className="w-2 h-2 rounded-full bg-[#2B4593]" />}
              </div>
              <p className="text-sm text-gray-700 capitalize">{option}</p>
            </button>
          ))}
        </div>

        {/* Save Button */}
        <button className="w-full bg-[#2B4593] text-white rounded-xl py-3 text-sm font-semibold mt-6">
          Save Changes
        </button>

      </div>
    </div>
  )
}

export default PrivacySettings