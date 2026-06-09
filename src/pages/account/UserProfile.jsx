import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiArrowLeft, HiLocationMarker, HiAcademicCap } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import { getUserProfile } from '../../api/userAPI'
import { getPostsByUser } from '../../api/postAPI'
import { sendRequest, getMyConnections } from '../../api/connectionAPI'
import { createChat } from '../../api/chatAPI'
import { useNavigate } from 'react-router-dom'

function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('none')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUserProfile(id), getPostsByUser(id), getMyConnections()])
      .then(([profileRes, postsRes, connectionsRes]) => {
        setProfile(profileRes.data)
        setPosts(postsRes.data)
        const isConnected = connectionsRes.data.find(
          (c) => c.connected_user_id === id
        )
        if (isConnected) setConnectionStatus('connected')
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleConnect = async () => {
    try {
      await sendRequest(id)
      setConnectionStatus('pending')
    } catch (err) {
      console.error(err)
    }
  }

  const handleMessage = async () => {
    try {
      const res = await createChat(id)
      navigate(`/chat/${res.data.chatId}`)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Profile</h1>
      </div>

      <div className="pt-16">
        <div className="px-4 py-6 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-[#8EB3E7] flex items-center justify-center text-white text-3xl font-bold">
              {profile?.fullName?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">{profile?.fullName}</h2>
                {profile?.isVerified && <span className="text-xs bg-[#2B4593] text-white px-2 py-0.5 rounded-full">✓ Verified</span>}
              </div>
              <p className="text-sm text-gray-500">@{profile?.username}</p>
              {profile?.bio && <p className="text-sm text-gray-500 mt-1">{profile?.bio}</p>}
            </div>
          </div>

          {profile?.college && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <HiAcademicCap size={16} />
              <span>{profile?.college}</span>
            </div>
          )}

          {profile?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <HiLocationMarker size={16} />
              <span>{profile?.location}</span>
            </div>
          )}

          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <p className="font-bold text-gray-800">{profile?.connectionCount}</p>
              <p className="text-xs text-gray-400">Connections</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800">{profile?.postCount}</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              disabled={connectionStatus !== 'none'}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                connectionStatus === 'connected'
                  ? 'bg-gray-100 text-gray-500'
                  : connectionStatus === 'pending'
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-[#2B4593] text-white'
              }`}
            >
              {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'pending' ? 'Pending' : 'Connect'}
            </button>
            <button
              onClick={handleMessage}
              className="flex-1 border border-[#2B4593] text-[#2B4593] py-2 rounded-xl text-sm font-semibold"
            >
              Message
            </button>
          </div>
        </div>

        {profile?.experience?.length > 0 && (
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Experience</h3>
            {profile.experience.map((exp) => (
              <div key={exp.id} className="flex gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#8EB3E7] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {exp.company?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{exp.title}</p>
                  <p className="text-xs text-gray-500">{exp.company} · {exp.start_date} - {exp.current ? 'Present' : exp.end_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {profile?.education?.length > 0 && (
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Education</h3>
            {profile.education.map((edu) => (
              <div key={edu.id} className="flex gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {edu.institution?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.degree} · {edu.start_year} - {edu.end_year}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {profile?.skills?.length > 0 && (
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill.id} className="bg-[#8EB3E7]/20 text-[#2B4593] text-xs px-3 py-1 rounded-full font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-4">
          <h3 className="font-bold text-gray-800 mb-3">Posts</h3>
          {posts.length === 0 ? (
            <p className="text-sm text-gray-400">No posts yet</p>
          ) : (
            posts.map((post) => (
              <Link to={`/post/${post.id}`} key={post.id}>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-3">
                  <p className="text-sm text-gray-700">{post.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default UserProfile