import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'

const initialBlocked = [
  { id: 1, name: 'John Smith', username: '@johnsmith' },
]

function BlockedUsers() {
  const [blocked, setBlocked] = useState(initialBlocked)

  const unblock = (id) => {
    setBlocked(blocked.filter((user) => user.id !== id))
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Blocked Users</h1>
      </div>

      <div className="pt-16">
        {blocked.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-20">No blocked users</p>
        ) : (
          blocked.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => unblock(user.id)}
                className="text-sm text-red-500 font-semibold border border-red-400 px-3 py-1 rounded-xl"
              >
                Unblock
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default BlockedUsers