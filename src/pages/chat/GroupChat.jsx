import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiPaperAirplane, HiPhotograph, HiUserGroup } from 'react-icons/hi'

const initialMessages = [
  { id: 1, user: 'Sara Khan', text: 'Meeting at 5pm today!', sent: false, time: '10:00 AM' },
]

function GroupChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (input.trim() === '') return
    setMessages([...messages, {
      id: messages.length + 1,
      user: 'Alan Joseph',
      text: input,
      sent: true,
      time: 'Just now'
    }])
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 flex items-center gap-3">
        <Link to="/chat">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#8EB3E7] flex items-center justify-center text-white">
          <HiUserGroup size={18} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-800">IEEE Study Group</p>
          <p className="text-xs text-gray-400">4 members</p>
        </div>
      </div>

      <div className="flex-1 pt-16 pb-20 px-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-3 ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs ${msg.sent ? '' : 'flex gap-2 items-end'}`}>
              {!msg.sent && (
                <div className="w-7 h-7 rounded-full bg-[#2B4593] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {msg.user.charAt(0)}
                </div>
              )}
              <div className={`px-4 py-2 rounded-2xl text-sm ${
                msg.sent
                  ? 'bg-[#2B4593] text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                {!msg.sent && <p className="text-xs font-semibold text-[#2B4593] mb-1">{msg.user}</p>}
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sent ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</p>
              </div>
            </div>
          </div>
        ))}
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
        <button onClick={sendMessage}>
          <HiPaperAirplane size={22} className="text-[#2B4593] rotate-90" />
        </button>
      </div>
    </div>
  )
}

export default GroupChat