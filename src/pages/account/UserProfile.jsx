import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiLocationMarker, HiAcademicCap, HiDotsVertical, HiGlobe, HiBriefcase } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import ReportModal from '../../components/common/ReportModal'
import { getUserProfile } from '../../api/userAPI'
import { getPostsByUser } from '../../api/postAPI'
import { sendRequest, getConnectionStatus, removeConnection } from '../../api/connectionAPI'
import { createChat } from '../../api/chatAPI'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

function UserProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('none')
  const [connectionId, setConnectionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)

  useEffect(() => {
    if (user?.id === id) {
      navigate('/profile')
      return
    }
    Promise.all([
      getUserProfile(id),
      getPostsByUser(id),
      getConnectionStatus(id)
    ])
      .then(([profileRes, postsRes, statusRes]) => {
        setProfile(profileRes.data)
        setPosts(postsRes.data)
        setConnectionStatus(statusRes.data.status)
        setConnectionId(statusRes.data.connectionId || null)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleConnect = async () => {
    if (connectLoading) return
    setConnectLoading(true)
    try {
      if (connectionStatus === 'connected') {
        await removeConnection(connectionId)
        setConnectionStatus('none')
        setConnectionId(null)
      } else if (connectionStatus === 'none') {
        const res = await sendRequest(id)
        setConnectionStatus('pending_sent')
        setConnectionId(res.data.id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setConnectLoading(false)
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

  const handleBlock = async () => {
    try {
      await API.post('/users/block', { blockedId: id })
      setBlocked(true)
      setShowMenu(false)
    } catch (err) {
      console.error(err)
    }
  }

  const getConnectButtonText = () => {
    if (connectLoading) return '...'
    switch (connectionStatus) {
      case 'connected': return 'Connected'
      case 'pending_sent': return 'Pending'
      case 'pending_received': return 'Accept'
      default: return 'Connect'
    }
  }

  const getConnectButtonStyle = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-gray-100 text-gray-600'
      case 'pending_sent': return 'bg-gray-100 text-gray-500'
      case 'pending_received': return 'bg-green-500 text-white'
      default: return 'bg-[#2B4593] text-white'
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  if (blocked) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center">
      <p className="text-lg font-bold text-gray-800 mb-2">User Blocked</p>
      <p className="text-sm text-gray-400 mb-6">You have blocked this user.</p>
      <Link to="/" className="bg-[#2B4593] text-white px-6 py-2 rounded-full text-sm font-semibold">
        Go Home
      </Link>
    </div>
  )

  const isStudentOrProfessional = profile?.userType === 'student' || profile?.userType === 'professional'
  const isCompany = profile?.userType === 'company'

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center justify-between">
        <Link to="/">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Profile</h1>
        <button onClick={() => setShowMenu(!showMenu)}>
          <HiDotsVertical size={22} className="text-gray-400" />
        </button>
      </div>

      {showMenu && (
        <div className="fixed top-14 right-4 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden w-44">
          <button
            onClick={() => { setShowReport(true); setShowMenu(false) }}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 border-b border-gray-50 hover:bg-gray-50"
          >
            Report User
          </button>
          <button
            onClick={handleBlock}
            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50"
          >
            Block User
          </button>
        </div>
      )}

      <div className="pt-16">
        <div className="px-4 py-6 border-b border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt="avatar" className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#8EB3E7] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {profile?.fullName?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-800">{profile?.fullName}</h2>
                {profile?.isVerified && (
                  <span className="text-xs bg-[#2B4593] text-white px-2 py-0.5 rounded-full">✓</span>
                )}
              </div>
              <p className="text-sm text-gray-400">@{profile?.username}</p>
              {profile?.bio && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{profile?.bio}</p>}
              {profile?.occupation && <p className="text-sm text-gray-500 mt-1">{profile?.occupation}</p>}
              {profile?.currentCompany && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <HiBriefcase size={14} /> {profile?.currentCompany}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 mb-4">
            {profile?.college && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiAcademicCap size={15} className="text-gray-400 flex-shrink-0" />
                <span>{profile?.college}</span>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiLocationMarker size={15} className="text-gray-400 flex-shrink-0" />
                <span>{profile?.location}</span>
              </div>
            )}
            {profile?.website && (
              <div className="flex items-center gap-2 text-sm text-[#2B4593]">
                <HiGlobe size={15} className="flex-shrink-0" />
                <a href={profile?.website} target="_blank" rel="noreferrer" className="hover:underline truncate">
                  {profile?.website}
                </a>
              </div>
            )}
          </div>

          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <p className="font-bold text-gray-800">{profile?.connectionCount || 0}</p>
              <p className="text-xs text-gray-400">Connections</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800">{profile?.postCount || 0}</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              disabled={connectLoading || connectionStatus === 'pending_sent'}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${getConnectButtonStyle()}`}
            >
              {getConnectButtonText()}
            </button>
            <button
              onClick={handleMessage}
              className="flex-1 border border-[#2B4593] text-[#2B4593] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2B4593] hover:text-white transition-colors"
            >
              Message
            </button>
          </div>
        </div>

        {/* Company Details */}
        {isCompany && (
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Company Info</h3>
            <div className="space-y-2">
              {profile?.industry && <p className="text-sm text-gray-600">🏭 {profile.industry}</p>}
              {profile?.companySize && <p className="text-sm text-gray-600">👥 {profile.companySize} employees</p>}
              {profile?.foundedYear && <p className="text-sm text-gray-600">📅 Founded {profile.foundedYear}</p>}
              {profile?.specialities && <p className="text-sm text-gray-600">⚡ {profile.specialities}</p>}
            </div>
          </div>
        )}

        {/* Experience */}
        {isStudentOrProfessional && profile?.experience?.length > 0 && (
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Experience</h3>
            {profile.experience.map((exp) => (
              <div key={exp.id} className="flex gap-3 mb-3 last:mb-0">
                <div className="w-10 h-10 rounded-xl bg-[#8EB3E7]/20 flex items-center justify-center text-[#2B4593] font-bold text-sm flex-shrink-0">
                  {exp.company?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{exp.title}</p>
                  <p className="text-xs text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-400">{exp.start_date} — {exp.current ? 'Present' : exp.end_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {isStudentOrProfessional && profile?.education?.length > 0 && (
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Education</h3>
            {profile.education.map((edu) => (
              <div key={edu.id} className="flex gap-3 mb-3 last:mb-0">
                <div className="w-10 h-10 rounded-xl bg-[#2B4593]/10 flex items-center justify-center text-[#2B4593] font-bold text-sm flex-shrink-0">
                  {edu.institution?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{edu.institution}</p>
                  {edu.degree && <p className="text-xs text-gray-600">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>}
                  {edu.start_year && <p className="text-xs text-gray-400">{edu.start_year} — {edu.end_year || 'Present'}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {isStudentOrProfessional && profile?.skills?.length > 0 && (
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill.id} className="bg-[#2B4593]/5 border border-[#2B4593]/20 text-[#2B4593] text-xs px-3 py-1.5 rounded-full font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="px-4 py-4">
          <h3 className="font-bold text-gray-800 mb-3">Posts</h3>
          {posts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No posts yet</p>
          ) : (
            posts.map((post) => (
              <Link to={`/post/${post.id}`} key={post.id}>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                  {post.media_url && (
                    post.media_type === 'video' ? (
                      <video src={post.media_url} className="w-full max-h-48 object-cover rounded-xl mt-2" />
                    ) : (
                      <img src={post.media_url} alt="media" className="w-full max-h-48 object-cover rounded-xl mt-2" />
                    )
                  )}
                  <div className="flex gap-4 text-gray-400 text-xs border-t mt-3 pt-2">
                    <span>👍 {post.reaction_count}</span>
                    <span>🙋 {post.attempted_count}</span>
                    <span>💬 {post.comment_count}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {showReport && (
        <ReportModal userId={id} onClose={() => setShowReport(false)} />
      )}

      <BottomNav />
    </div>
  )
}

export default UserProfile