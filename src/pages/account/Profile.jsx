import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiCog, HiLocationMarker, HiAcademicCap, HiGlobe, HiBriefcase } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import { getMyProfile } from '../../api/userAPI'
import { getPostsByUser } from '../../api/postAPI'

// Normalize profile data to handle both snake_case and camelCase from backend
function normalizeProfile(p) {
  if (!p) return p
  return {
    ...p,
    fullName: p.fullName || p.full_name || '',
    profilePhoto: p.profilePhoto || p.profile_photo || '',
    userType: p.userType || p.user_type || '',
    isVerified: p.isVerified ?? p.is_verified ?? false,
    currentCompany: p.currentCompany || p.current_company || '',
    companySize: p.companySize || p.company_size || '',
    foundedYear: p.foundedYear || p.founded_year || '',
    connectionCount: p.connectionCount ?? p.connection_count ?? 0,
    postCount: p.postCount ?? p.post_count ?? 0,
    bio: p.bio || '',
    location: p.location || '',
    website: p.website || '',
    occupation: p.occupation || '',
    industry: p.industry || '',
    specialities: p.specialities || '',
    college: p.college || '',
    username: p.username || '',
    experience: p.experience || [],
    education: p.education || [],
    skills: p.skills || [],
  }
}

function Profile() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  console.log('RAW API RESPONSE TEST:')        // add this
  getMyProfile()
    .then((res) => {
      console.log('RAW:', res)                  // add this
      console.log('DATA:', res.data)            // add this
      const normalized = normalizeProfile(res.data)
      setProfile(normalized)
      return getPostsByUser(normalized.id)
    })
    .then((res) => setPosts(res.data))
    .catch((err) => console.error('ERR:', err))
    .finally(() => setLoading(false))
}, [])

  if (loading) return (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <p className="text-gray-400 text-sm">Loading...</p>
  </div>
)

// TEMPORARY DEBUG - add this right after loading check
if (!profile) return (
  <div className="min-h-screen bg-white p-6 pt-20">
    <p className="text-red-500 font-bold mb-4">Profile is NULL - API failed</p>
  </div>
)

if (profile) return (
  <div className="min-h-screen bg-white p-6 pt-20 overflow-auto">
    <p className="font-bold text-green-600 mb-2">API RETURNED DATA:</p>
    <pre className="text-xs text-gray-700 break-all whitespace-pre-wrap">
      {JSON.stringify(profile, null, 2)}
    </pre>
  </div>
)

  const isStudentOrProfessional = profile?.userType === 'student' || profile?.userType === 'professional'
  const isCompany = profile?.userType === 'company'

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">My Profile</h1>
        <Link to="/settings">
          <HiCog size={22} className="text-[#2B4593]" />
        </Link>
      </div>

      <div className="pt-16">
        {/* Header */}
        <div className="px-4 py-6 border-b border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt="avatar" className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#2B4593] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {profile?.fullName?.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-800">{profile?.fullName}</h2>
                {profile?.isVerified && (
                  <span className="text-xs bg-[#2B4593] text-white px-2 py-0.5 rounded-full flex-shrink-0">✓ Verified</span>
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

          {/* Stats */}
          <div className="flex gap-5 mb-4">
            <Link to="/connections" className="text-center">
              <p className="font-bold text-gray-800">{profile?.connectionCount || 0}</p>
              <p className="text-xs text-gray-400">Connections</p>
            </Link>
            <div className="text-center">
              <p className="font-bold text-gray-800">{profile?.postCount || 0}</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
            <Link to="/connections/requests" className="text-center">
              <p className="font-bold text-[#2B4593]">Requests</p>
              <p className="text-xs text-gray-400">Pending</p>
            </Link>
            <Link to="/bookmarks" className="text-center">
              <p className="font-bold text-gray-800">Saved</p>
              <p className="text-xs text-gray-400">Bookmarks</p>
            </Link>
          </div>

          <Link to="/settings/edit-profile">
            <button className="w-full border border-[#2B4593] text-[#2B4593] rounded-xl py-2.5 text-sm font-semibold hover:bg-[#2B4593] hover:text-white transition-colors">
              Edit Profile
            </button>
          </Link>
        </div>

        {/* Company Details */}
        {isCompany && profile?.industry && (
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Company Info</h3>
            <div className="space-y-2">
              {profile?.industry && <p className="text-sm text-gray-600">🏭 {profile?.industry}</p>}
              {profile?.companySize && <p className="text-sm text-gray-600">👥 {profile?.companySize} employees</p>}
              {profile?.foundedYear && <p className="text-sm text-gray-600">📅 Founded {profile?.foundedYear}</p>}
              {profile?.specialities && <p className="text-sm text-gray-600">⚡ {profile?.specialities}</p>}
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
                  <p className="text-xs text-gray-400">
                    {exp.start_date || exp.startDate} — {exp.current ? 'Present' : (exp.end_date || exp.endDate)}
                  </p>
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
                  {(edu.degree) && (
                    <p className="text-xs text-gray-600">
                      {edu.degree}{(edu.field) ? ` · ${edu.field}` : ''}
                    </p>
                  )}
                  {(edu.start_year || edu.startYear) && (
                    <p className="text-xs text-gray-400">
                      {edu.start_year || edu.startYear} — {edu.end_year || edu.endYear || 'Present'}
                    </p>
                  )}
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
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No posts yet</p>
              <Link to="/post/create" className="text-[#2B4593] text-sm font-semibold mt-2 block">
                Create your first post →
              </Link>
            </div>
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

export default Profile
