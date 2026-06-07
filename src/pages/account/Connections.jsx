import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import { getMyConnections, removeConnection } from '../../api/connectionAPI'

function Connections() {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyConnections()
      .then((res) => setConnections(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (id) => {
    try {
      await removeConnection(id)
      setConnections(connections.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/profile">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">My Connections</h1>
      </div>

      <div className="pt-16">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : connections.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">No connections yet</p>
        ) : (
          connections.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <Link to={`/user/${c.connected_user_id}`} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold">
                  {c.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.full_name}</p>
                  <p className="text-xs text-gray-400">@{c.username}</p>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(c.id)}
                className="text-sm text-red-500 font-semibold border border-red-400 px-3 py-1 rounded-xl"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Connections