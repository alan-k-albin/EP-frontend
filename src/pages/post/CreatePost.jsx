import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiPhotograph, HiVideoCamera, HiPlus, HiTrash } from 'react-icons/hi'
import { createPost } from '../../api/postAPI'
import { useAuth } from '../../context/AuthContext'

function CreatePost() {
  const [content, setContent] = useState('')
  const [showPoll, setShowPoll] = useState(false)
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, ''])
  }

  const removePollOption = (index) => {
    if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, i) => i !== index))
  }

  const updatePollOption = (index, value) => {
    const updated = [...pollOptions]
    updated[index] = value
    setPollOptions(updated)
  }

  const handlePost = async () => {
    if (content.trim() === '') return
    setLoading(true)
    try {
      await createPost({ content, mediaUrl: null, mediaType: null })
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 flex items-center justify-between">
        <Link to="/">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Create Post</h1>
        <button
          onClick={handlePost}
          disabled={loading}
          className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-1.5 rounded-full disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="pt-16 px-4">
        <div className="flex items-center gap-3 py-4">
          <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold">
            {user?.fullName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{user?.fullName}</p>
            <p className="text-xs text-gray-400">@{user?.username}</p>
          </div>
        </div>

        <textarea
          placeholder="What do you want to share?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full text-sm text-gray-800 focus:outline-none resize-none placeholder-gray-400"
        />

        {showPoll && (
          <div className="mt-4 border border-gray-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Poll Options</p>
            {pollOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2B4593]"
                />
                {pollOptions.length > 2 && (
                  <button onClick={() => removePollOption(index)}>
                    <HiTrash size={18} className="text-red-400" />
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button onClick={addPollOption} className="flex items-center gap-1 text-sm text-[#2B4593] font-semibold mt-2">
                <HiPlus size={16} /> Add Option
              </button>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-6">
        <button className="flex items-center gap-2 text-[#2B4593]">
          <HiPhotograph size={22} />
          <span className="text-sm">Photo</span>
        </button>
        <button className="flex items-center gap-2 text-[#2B4593]">
          <HiVideoCamera size={22} />
          <span className="text-sm">Video</span>
        </button>
        <button
          onClick={() => setShowPoll(!showPoll)}
          className={`flex items-center gap-2 ${showPoll ? 'text-red-400' : 'text-[#2B4593]'}`}
        >
          <HiPlus size={22} />
          <span className="text-sm">{showPoll ? 'Remove Poll' : 'Add Poll'}</span>
        </button>
      </div>
    </div>
  )
}

export default CreatePost