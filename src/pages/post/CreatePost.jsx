import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiPhotograph, HiVideoCamera, HiPlus, HiTrash, HiX } from 'react-icons/hi'
import { createPost } from '../../api/postAPI'
import { createPoll } from '../../api/pollAPI'
import { uploadMedia } from '../../api/mediaAPI'
import { useAuth } from '../../context/AuthContext'

function CreatePost() {
  const [content, setContent] = useState('')
  const [showPoll, setShowPoll] = useState(false)
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaUrl, setMediaUrl] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()
  const imageRef = useRef()
  const videoRef = useRef()

  const handleMediaUpload = async (file, type) => {
    setUploading(true)
    setError('')
    try {
      const preview = URL.createObjectURL(file)
      setMediaPreview(preview)
      setMediaType(type)
      const res = await uploadMedia(file)
      setMediaUrl(res.data.url)
    } catch (err) {
      setError('Media upload failed. Please try again.')
      setMediaPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const removeMedia = () => {
    setMediaPreview(null)
    setMediaUrl(null)
    setMediaType(null)
  }

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
    if (content.trim() === '') {
      setError('Please write something!')
      return
    }
    setLoading(true)
    try {
      const postRes = await createPost({ content, mediaUrl, mediaType })
      if (showPoll) {
        const validOptions = pollOptions.filter((o) => o.trim() !== '')
        if (validOptions.length >= 2) {
          await createPoll({ postId: postRes.data.id, options: validOptions })
        }
      }
      navigate('/')
    } catch (err) {
      setError('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 z-50 flex items-center justify-between">
        <Link to="/">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">New Post</h1>
        <button
          onClick={handlePost}
          disabled={loading || uploading}
          className="bg-[#2B4593] text-white text-sm font-semibold px-5 py-1.5 rounded-full disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="pt-16 px-4">
        <div className="flex items-center gap-3 py-4">
          <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-lg">
            {user?.fullName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{user?.fullName}</p>
            <p className="text-xs text-gray-400">@{user?.username}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <textarea
          placeholder="What do you want to share?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full text-sm text-gray-800 focus:outline-none resize-none placeholder-gray-300 leading-relaxed"
        />

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
            <div className="w-4 h-4 border-2 border-[#2B4593] border-t-transparent rounded-full animate-spin"></div>
            Uploading...
          </div>
        )}

        {mediaPreview && !uploading && (
          <div className="relative mt-3 rounded-2xl overflow-hidden">
            {mediaType === 'image' ? (
              <img src={mediaPreview} alt="preview" className="w-full max-h-80 object-cover rounded-2xl" />
            ) : (
              <video src={mediaPreview} controls className="w-full max-h-80 rounded-2xl" />
            )}
            <button onClick={removeMedia} className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
              <HiX size={16} className="text-white" />
            </button>
          </div>
        )}

        {showPoll && (
          <div className="mt-4 border border-gray-100 rounded-2xl p-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700 mb-3">Poll Options</p>
            {pollOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2B4593]"
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

      <input type="file" accept="image/*" ref={imageRef} className="hidden" onChange={(e) => handleMediaUpload(e.target.files[0], 'image')} />
      <input type="file" accept="video/*" ref={videoRef} className="hidden" onChange={(e) => handleMediaUpload(e.target.files[0], 'video')} />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-6">
        <button onClick={() => imageRef.current.click()} className="flex items-center gap-2 text-[#2B4593]">
          <HiPhotograph size={22} />
          <span className="text-sm">Photo</span>
        </button>
        <button onClick={() => videoRef.current.click()} className="flex items-center gap-2 text-[#2B4593]">
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