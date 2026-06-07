import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import { getPendingRequests, acceptRequest, declineRequest } from '../../api/connectionAPI'

function ConnectionRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPendingRequests()
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id)
      setRequests(requests.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDecline = async (id) => {
    try {
      await declineRequest(id)
      setRequests(requests.filter((r) => r.id !== id))
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
        <h1 className="text-lg font-bold text-gray-800">Connection Requests</h1>
      </div>

      <div className="pt-16">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">No pending requests</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-[#8EB3E7] flex items-center justify-center text-white font-bold">
                  {r.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.full_name}</p>
                  <p className="text-xs text-gray-400">@{r.username}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(r.id)}
                  className="flex-1 bg-[#2B4593] text-white text-sm font-semibold py-2 rounded-xl"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(r.id)}
                  className="flex-1 border border-red-400 text-red-500 text-sm font-semibold py-2 rounded-xl"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ConnectionRequests