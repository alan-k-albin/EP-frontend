import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiPencilAlt, HiUserGroup, HiX } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import { getMyChats, createGroupChat } from '../../api/chatAPI'
import { getMyConnections } from '../../api/connectionAPI'

function ChatList() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [connections, setConnections] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [creating, setCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getMyChats(), getMyConnections()])
      .then(([chatsRes, connectionsRes]) => {
        setChats(chatsRes.data)
        setConnections(connectionsRes.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((m) => m !== userId) : [...prev, userId]
    )
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) return
    setCreating(true)
    try {
      const res = await createGroupChat(groupName, selectedMembers)
      setShowGroupModal(false)
      setGroupName('')
      setSelectedMembers([])
      navigate(`/chat/group/${res.data.chatId}`)
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const filteredChats = chats.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Chats</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowGroupModal(true)}>
            <HiUserGroup size={22} className="text-[#2B4593]" />
          </button>
          <HiPencilAlt size={22} className="text-[#2B4593]" />
        </div>
      </div>

      <div className="pt-16 px-4 py-3">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      <div>
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : filteredChats.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">
            {searchQuery ? 'No chats found' : 'No chats yet. Connect with someone and start chatting!'}
          </p>
        ) : (
          filteredChats.map((chat) => (
            <Link
              to={chat.is_group ? `/chat/group/${chat.id}` : `/chat/${chat.id}`}
              key={chat.id}
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 hover:bg-gray-50">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${chat.is_group ? 'bg-[#8EB3E7]' : 'bg-[#2B4593]'}`}>
                  {chat.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-800 truncate">{chat.name || 'Unknown'}</p>
                    {chat.last_message_time && (
                      <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {new Date(chat.last_message_time).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {chat.last_message || 'No messages yet'}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <button onClick={() => { setShowGroupModal(false); setGroupName(''); setSelectedMembers([]) }}>
              <HiX size={22} className="text-gray-500" />
            </button>
            <h2 className="text-base font-semibold text-gray-800">New Group</h2>
            <button
              onClick={handleCreateGroup}
              disabled={creating || !groupName.trim() || selectedMembers.length === 0}
              className="text-[#2B4593] font-semibold text-sm disabled:opacity-40"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>

          <div className="px-4 py-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Group name *"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <p className="px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Select Members from Connections ({selectedMembers.length} selected)
            </p>
            {connections.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-10 px-4">
                No connections yet. Connect with people first!
              </p>
            ) : (
              connections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleMember(c.connected_user_id)}
                  className="flex items-center gap-3 w-full px-4 py-3 border-b border-gray-50 hover:bg-gray-50"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedMembers.includes(c.connected_user_id) ? 'border-[#2B4593] bg-[#2B4593]' : 'border-gray-300'
                  }`}>
                    {selectedMembers.includes(c.connected_user_id) && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  {c.profile_photo ? (
                    <img src={c.profile_photo} alt="avatar" className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                      {c.full_name?.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">{c.full_name}</p>
                    <p className="text-xs text-gray-400">@{c.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

export default ChatList