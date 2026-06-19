import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  getAdminStats, getAllUsers, deleteUser, banUser, promoteUser,
  getAllPosts, adminDeletePost,
  getPendingVerifications, approveVerification, rejectVerification,
  getAllReports, resolveReport,
} from '../../api/adminAPI'

const TABS = ['Dashboard', 'Users', 'Posts', 'Verifications', 'Reports']

function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [loading, setLoading] = useState(false)

  // Dashboard
  const [stats, setStats] = useState(null)

  // Users
  const [users, setUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [userType, setUserType] = useState('all')
  const [userPage, setUserPage] = useState(1)
  const [userTotal, setUserTotal] = useState(0)
  const [userTotalPages, setUserTotalPages] = useState(1)

  // Posts
  const [posts, setPosts] = useState([])
  const [postSearch, setPostSearch] = useState('')
  const [postPage, setPostPage] = useState(1)
  const [postTotalPages, setPostTotalPages] = useState(1)

  // Verifications
  const [verifications, setVerifications] = useState([])

  // Reports
  const [reports, setReports] = useState([])
  const [reportStatus, setReportStatus] = useState('pending')

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin && !user.is_admin) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (activeTab === 'Dashboard') fetchStats()
    if (activeTab === 'Users') fetchUsers()
    if (activeTab === 'Posts') fetchPosts()
    if (activeTab === 'Verifications') fetchVerifications()
    if (activeTab === 'Reports') fetchReports()
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'Users') fetchUsers()
  }, [userSearch, userType, userPage])

  useEffect(() => {
    if (activeTab === 'Posts') fetchPosts()
  }, [postSearch, postPage])

  useEffect(() => {
    if (activeTab === 'Reports') fetchReports()
  }, [reportStatus])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await getAdminStats()
      setStats(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await getAllUsers({ search: userSearch, type: userType, page: userPage })
      setUsers(res.data.users)
      setUserTotal(res.data.total)
      setUserTotalPages(res.data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await getAllPosts({ search: postSearch, page: postPage })
      setPosts(res.data.posts)
      setPostTotalPages(res.data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchVerifications = async () => {
    setLoading(true)
    try {
      const res = await getPendingVerifications()
      setVerifications(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await getAllReports(reportStatus)
      setReports(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return
    try {
      await deleteUser(userId)
      setUsers(users.filter((u) => u.id !== userId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleBanUser = async (userId) => {
    try {
      const res = await banUser(userId)
      setUsers(users.map((u) => u.id === userId ? { ...u, is_banned: res.data.is_banned } : u))
    } catch (err) {
      alert('Failed to ban/unban user')
    }
  }

  const handlePromoteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to change admin status for this user?')) return
    try {
      const res = await promoteUser(userId)
      setUsers(users.map((u) => u.id === userId ? { ...u, is_admin: res.data.is_admin } : u))
    } catch (err) {
      alert('Failed to update admin status')
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post permanently?')) return
    try {
      await adminDeletePost(postId)
      setPosts(posts.filter((p) => p.id !== postId))
    } catch (err) {
      alert('Failed to delete post')
    }
  }

  const handleApproveVerification = async (id) => {
    try {
      await approveVerification(id)
      setVerifications(verifications.filter((v) => v.id !== id))
    } catch (err) {
      alert('Failed to approve')
    }
  }

  const handleRejectVerification = async (id) => {
    try {
      await rejectVerification(id)
      setVerifications(verifications.filter((v) => v.id !== id))
    } catch (err) {
      alert('Failed to reject')
    }
  }

  const handleResolveReport = async (reportId, action) => {
    try {
      await resolveReport(reportId, action)
      setReports(reports.filter((r) => r.id !== reportId))
    } catch (err) {
      alert('Failed to resolve report')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2B4593] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black">EP</h1>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm opacity-80">@{user?.username}</p>
          <button
            onClick={() => navigate('/')}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← Back to EP
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#2B4593] text-[#2B4593]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab === 'Verifications' && verifications.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {verifications.length}
                </span>
              )}
              {tab === 'Reports' && reportStatus === 'pending' && reports.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {reports.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">

        {/* ── DASHBOARD ── */}
        {activeTab === 'Dashboard' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-6">Platform Overview</h2>
            {loading ? (
              <p className="text-gray-400 text-sm">Loading stats...</p>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Total Posts', value: stats.totalPosts, color: 'bg-green-50 text-green-600' },
                    { label: 'Connections', value: stats.totalConnections, color: 'bg-purple-50 text-purple-600' },
                    { label: 'Reports', value: stats.totalReports, color: 'bg-red-50 text-red-600' },
                    { label: 'New Users (7d)', value: stats.newUsersThisWeek, color: 'bg-yellow-50 text-yellow-600' },
                    { label: 'New Posts (7d)', value: stats.newPostsThisWeek, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Pending Verifications', value: stats.pendingVerifications, color: 'bg-orange-50 text-orange-600' },
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.color} rounded-2xl p-4`}>
                      <p className="text-2xl font-black">{stat.value}</p>
                      <p className="text-xs font-medium mt-1 opacity-80">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4">Users by Type</h3>
                  <div className="space-y-3">
                    {stats.usersByType?.map((item) => (
                      <div key={item.user_type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{item.user_type || 'Unknown'}</span>
                        <span className="font-bold text-[#2B4593]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'Users' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Users <span className="text-gray-400 font-normal text-sm">({userTotal} total)</span></h2>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Search by name, username or email..."
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setUserPage(1) }}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593]"
              />
              <select
                value={userType}
                onChange={(e) => { setUserType(e.target.value); setUserPage(1) }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593]"
              >
                <option value="all">All Types</option>
                <option value="public">Public</option>
                <option value="student">Student</option>
                <option value="professional">Professional</option>
                <option value="company">Company</option>
              </select>
            </div>

            {loading ? (
              <p className="text-gray-400 text-sm">Loading users...</p>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                    {u.profile_photo ? (
                      <img src={u.profile_photo} alt="avatar" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold flex-shrink-0">
                        {u.full_name?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-gray-800">{u.full_name}</p>
                        {u.is_verified && <span className="text-xs bg-[#2B4593] text-white px-1.5 py-0.5 rounded-full">✓ Verified</span>}
                        {u.is_admin && <span className="text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full">Admin</span>}
                        {u.is_banned && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Banned</span>}
                      </div>
                      <p className="text-xs text-gray-400">@{u.username} · {u.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{u.user_type} · Joined {new Date(u.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                      <button
                        onClick={() => handleBanUser(u.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${u.is_banned ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                      >
                        {u.is_banned ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => handlePromoteUser(u.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      >
                        {u.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {userTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                  disabled={userPage === 1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {userPage} of {userTotalPages}</span>
                <button
                  onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                  disabled={userPage === userTotalPages}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── POSTS ── */}
        {activeTab === 'Posts' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Posts</h2>
            <input
              type="text"
              placeholder="Search by content or username..."
              value={postSearch}
              onChange={(e) => { setPostSearch(e.target.value); setPostPage(1) }}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593] mb-4"
            />

            {loading ? (
              <p className="text-gray-400 text-sm">Loading posts...</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {post.profile_photo ? (
                          <img src={post.profile_photo} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-xs">
                            {post.full_name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{post.full_name}</p>
                          <p className="text-xs text-gray-400">@{post.username} · {new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">{post.content}</p>
                    {post.media_url && (
                      post.media_type === 'video'
                        ? <video src={post.media_url} className="w-full max-h-40 object-cover rounded-xl" />
                        : <img src={post.media_url} alt="media" className="w-full max-h-40 object-cover rounded-xl" />
                    )}
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-gray-400">👍 {post.reaction_count} likes</span>
                      <span className="text-xs text-gray-400">💬 {post.comment_count} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {postTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button onClick={() => setPostPage((p) => Math.max(1, p - 1))} disabled={postPage === 1} className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Previous</button>
                <span className="text-sm text-gray-500">Page {postPage} of {postTotalPages}</span>
                <button onClick={() => setPostPage((p) => Math.min(postTotalPages, p + 1))} disabled={postPage === postTotalPages} className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            )}
          </div>
        )}

        {/* ── VERIFICATIONS ── */}
        {activeTab === 'Verifications' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Pending Student Verifications
              {verifications.length > 0 && <span className="ml-2 text-sm text-red-500">({verifications.length} pending)</span>}
            </h2>

            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : verifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                <p className="text-gray-400 text-sm">No pending verifications 🎉</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifications.map((v) => (
                  <div key={v.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      {v.profile_photo ? (
                        <img src={v.profile_photo} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold">
                          {v.full_name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{v.full_name}</p>
                        <p className="text-xs text-gray-400">@{v.username} · {v.email}</p>
                        <p className="text-xs text-gray-500 mt-0.5">College: {v.college}</p>
                        {v.id_number && <p className="text-xs text-gray-500">ID Number: {v.id_number}</p>}
                      </div>
                    </div>

                    {v.id_photo && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2 font-medium">ID Card Photo:</p>
                        <img src={v.id_photo} alt="ID Card" className="w-full max-h-48 object-contain rounded-xl border border-gray-100" />
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mb-4">Submitted: {new Date(v.created_at).toLocaleDateString()}</p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveVerification(v.id)}
                        className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRejectVerification(v.id)}
                        className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REPORTS ── */}
        {activeTab === 'Reports' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Reports</h2>
              <div className="flex gap-2">
                {['pending', 'resolved'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setReportStatus(s)}
                    className={`text-sm px-4 py-1.5 rounded-lg font-semibold capitalize transition-colors ${reportStatus === s ? 'bg-[#2B4593] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="text-gray-400 text-sm">Loading reports...</p>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                <p className="text-gray-400 text-sm">No {reportStatus} reports</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-gray-400">
                        Reported by <span className="font-semibold text-gray-600">@{report.reporter_username}</span> · {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gray-400 font-medium mb-1">Reason:</p>
                      <p className="text-sm text-gray-700">{report.reason}</p>
                    </div>

                    {report.reported_user_name && (
                      <p className="text-sm text-gray-600 mb-2">
                        👤 Reported user: <span className="font-semibold">@{report.reported_user_username}</span>
                      </p>
                    )}

                    {report.post_content && (
                      <div className="bg-gray-50 rounded-xl p-3 mb-3">
                        <p className="text-xs text-gray-400 font-medium mb-1">Reported post:</p>
                        <p className="text-sm text-gray-700 line-clamp-3">{report.post_content}</p>
                      </div>
                    )}

                    {reportStatus === 'pending' && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleResolveReport(report.id, 'dismiss')}
                          className="text-xs px-3 py-2 rounded-lg font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          Dismiss
                        </button>
                        {report.reported_post_id && (
                          <button
                            onClick={() => handleResolveReport(report.id, 'delete_post')}
                            className="text-xs px-3 py-2 rounded-lg font-semibold bg-orange-50 text-orange-600 hover:bg-orange-100"
                          >
                            Delete Post
                          </button>
                        )}
                        {report.reported_user_id && (
                          <button
                            onClick={() => handleResolveReport(report.id, 'ban_user')}
                            className="text-xs px-3 py-2 rounded-lg font-semibold bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            Ban User
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel