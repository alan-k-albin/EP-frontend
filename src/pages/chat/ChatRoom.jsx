import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiArrowLeft, HiPaperAirplane, HiPhotograph, HiDotsVertical } from 'react-icons/hi'
import { getChatMessages, sendMessage } from '../../api/chatAPI'
import { useAuth } from '../../context/AuthContext'
import io from 'socket.io-client'

const socket = io('https://ep-backend-1vay.onrender.com')

function ChatRoom() {
  const { id } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

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

  const handleSend = async () => {
    if (input.trim() === '') return
    try {
      const res = await sendMessage(id, { content: input })
      socket.emit('send_message', { ...res.data, chatId: id })
      setMessages((prev) => [...prev, res.data])
      setInput('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 flex items-center gap-3">
        <Link to="/chat">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
          U
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-800">Chat</p>
        </div>
        <HiDotsVertical size={20} className="text-gray-400" />
      </div>

      <div className="flex-1 pt-16 pb-20 px-4 overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex mb-3 ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.sender_id === user?.id
                  ? 'bg-[#2B4593] text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <HiPhotograph size={24} className="text-[#2B4593] flex-shrink-0 cursor-pointer" />
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button onClick={handleSend}>
          <HiPaperAirplane size={22} className="text-[#2B4593] rotate-90" />
        </button>
      </div>
    </div>
  )
}

export default ChatRoom