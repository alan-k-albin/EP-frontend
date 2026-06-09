import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import API from '../../api/axios'

function BlockedUsers() {
  const [blocked, setBlocked] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/users/blocked')
      .then((res) => setBlocked(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleUnblock = async (id) => {
    try {
      await API.delete(`/users/block/${id}`)
      setBlocked(blocked.filter((u) => u.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Blocked Users</h1>
      </div>

      <div className="pt-16">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : blocked.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">No blocked users</p>
        ) : (
          blocked.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {user.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.full_name}</p>
                  <p className="text-xs text-gray-400">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => handleUnblock(user.id)}
                className="text-sm text-red-500 font-semibold border border-red-300 px-3 py-1 rounded-xl"
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