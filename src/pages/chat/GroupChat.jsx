import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiArrowLeft, HiPaperAirplane, HiPhotograph, HiUserGroup, HiX } from 'react-icons/hi'
import { getChatMessages, sendMessage } from '../../api/chatAPI'
import { uploadMedia } from '../../api/mediaAPI'
import { useAuth } from '../../context/AuthContext'
import io from 'socket.io-client'

const socket = io('https://ep-backend-1vay.onrender.com')

function GroupChat() {
  const { id } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaUrl, setMediaUrl] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    getChatMessages(id)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))

    socket.emit('join_chat', id)
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    return () => {
      socket.emit('leave_chat', id)
      socket.off('receive_message')
    }
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleMediaUpload = async (file) => {
    setUploading(true)
    try {
      const preview = URL.createObjectURL(file)
      setMediaPreview(preview)
      const res = await uploadMedia(file)
      setMediaUrl(res.data.url)
      setMediaType(res.data.mediaType)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const removeMedia = () => {
    setMediaPreview(null)
    setMediaUrl(null)
    setMediaType(null)
  }

  const handleSend = async () => {
    if (!input.trim() && !mediaUrl) return
    try {
      const res = await sendMessage(id, { content: input, mediaUrl, mediaType })
      socket.emit('send_message', { ...res.data, chatId: id })
      setMessages((prev) => [...prev, res.data])
      setInput('')
      removeMedia()
    } catch (err) {
      console.error(err)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 z-50 flex items-center gap-3">
        <Link to="/chat">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#8EB3E7] flex items-center justify-center text-white">
          <HiUserGroup size={18} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-800">Group Chat</p>
        </div>
      </div>

      <div className="flex-1 pt-16 pb-24 px-4 overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex mb-3 ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs ${msg.sender_id === user?.id ? '' : 'flex gap-2 items-end'}`}>
                {msg.sender_id !== user?.id && (
                  <div className="w-7 h-7 rounded-full bg-[#2B4593] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {msg.full_name?.charAt(0)}
                  </div>
                )}
                <div className={`rounded-2xl overflow-hidden ${
                  msg.sender_id === user?.id
                    ? 'bg-[#2B4593] text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.sender_id !== user?.id && (
                    <p className="text-xs font-semibold text-[#2B4593] px-4 pt-2">{msg.full_name}</p>
                  )}
                  {msg.media_url && (
                    msg.media_type === 'video' ? (
                      <video src={msg.media_url} controls className="w-full max-h-48" />
                    ) : (
                      <img src={msg.media_url} alt="media" className="w-full max-h-48 object-cover" />
                    )
                  )}
                  {msg.content && (
                    <div className="px-4 py-2">
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {mediaPreview && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2">
          <div className="relative inline-block">
            {mediaType === 'video' ? (
              <video src={mediaPreview} className="h-20 rounded-xl" />
            ) : (
              <img src={mediaPreview} alt="preview" className="h-20 rounded-xl object-cover" />
            )}
            <button onClick={removeMedia} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5">
              <HiX size={14} className="text-white" />
            </button>
          </div>
          {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3">
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileRef}
          className="hidden"
          onChange={(e) => handleMediaUpload(e.target.files[0])}
        />
        <button onClick={() => fileRef.current.click()}>
          <HiPhotograph size={24} className="text-[#2B4593]" />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button onClick={handleSend} disabled={uploading}>
          <HiPaperAirplane size={22} className="text-[#2B4593] rotate-90" />
        </button>
      </div>
    </div>
  )
}

export default GroupChat