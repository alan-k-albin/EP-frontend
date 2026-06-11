import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiSearch, HiPencilAlt, HiDotsVertical, HiBookmark } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import ReportModal from '../../components/common/ReportModal'
import PollCard from '../../components/feed/PollCard'
import { getFeedPosts, reactToPost, attemptPost, bookmarkPost, repostPost, getWhoLiked, getWhoAttempted } from '../../api/postAPI'
import { useAuth } from '../../context/AuthContext'

const renderContent = (content) => {
  if (!content) return null
  const parts = content.split(/(#\w+)/g)
  return parts.map((part, i) =>
    part.startsWith('#') ? (
      <Link key={i} to={`/hashtag/${part.slice(1)}`} className="text-[#2B4593] font-semibold hover:underline">
        {part}
      </Link>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sharePost, setSharePost] = useState(null)
  const [reportPost, setReportPost] = useState(null)
  const [postMenu, setPostMenu] = useState(null)
  const [whoLiked, setWhoLiked] = useState(null)
  const [whoAttempted, setWhoAttempted] = useState(null)
  const [peopleList, setPeopleList] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    getFeedPosts()
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleReact = async (postId) => {
    try {
      const res = await reactToPost(postId, 'like')
      setPosts(posts.map((p) =>
        p.id === postId
          ? { ...p, reaction_count: res.data.count, liked: res.data.liked }
          : p
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAttempt = async (postId) => {
    try {
      const res = await attemptPost(postId)
      setPosts(posts.map((p) =>
        p.id === postId
          ? { ...p, attempted_count: res.data.count, attempted: res.data.attempted }
          : p
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleShowLiked = async (postId) => {
    try {
      const res = await getWhoLiked(postId)
      setPeopleList(res.data)
      setWhoLiked(postId)
    } catch (err) {
      console.error(err)
    }
  }

  const handleShowAttempted = async (postId) => {
    try {
      const res = await getWhoAttempted(postId)
      setPeopleList(res.data)
      setWhoAttempted(postId)
    } catch (err) {
      console.error(err)
    }
  }

  const handleBookmark = async (postId) => {
    try {
      const res = await bookmarkPost(postId)
      setPosts(posts.map((p) =>
        p.id === postId ? { ...p, bookmarked: res.data.bookmarked } : p
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleRepost = async (postId) => {
    try {
      await repostPost(postId)
      setSharePost(null)
      alert('Reposted successfully!')
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopyLink = (postId) => {
    navigator.clipboard.writeText(`https://ep-app.vercel.app/post/${postId}`)
    setSharePost(null)
    alert('Link copied!')
  }

  const handleShareWhatsApp = (post) => {
    window.open(`https://wa.me/?text=Check this post on EP: https://ep-app.vercel.app/post/${post.id}`, '_blank')
    setSharePost(null)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-50">
        <h1 className="text-2xl font-black text-[#2B4593]">EP</h1>
        <div className="flex items-center gap-4">
          <Link to="/explore">
            <HiSearch size={24} className="text-gray-500" />
          </Link>
          <Link to="/post/create">
            <HiPencilAlt size={24} className="text-[#2B4593]" />
          </Link>
        </div>
      </div>

      <div className="pt-16 px-4">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-sm mb-2">No posts yet!</p>
            <p className="text-gray-400 text-xs">Connect with people or create your first post</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-4 mt-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Link to={`/user/${post.user_id}`}>
                    {post.profile_photo ? (
                      <img src={post.profile_photo} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                        {post.full_name?.charAt(0)}
                      </div>
                    )}
                  </Link>
                  <div>
                    <div className="flex items-center gap-1">
                      <Link to={`/user/${post.user_id}`}>
                        <p className="font-semibold text-sm text-gray-800">{post.full_name}</p>
                      </Link>
                      {post.is_verified && (
                        <span className="text-xs bg-[#2B4593] text-white px-1.5 py-0.5 rounded-full">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">@{post.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleBookmark(post.id)}>
                    <HiBookmark size={18} className={post.bookmarked ? 'text-[#2B4593]' : 'text-gray-300'} />
                  </button>
                  <button onClick={() => setPostMenu(postMenu === post.id ? null : post.id)}>
                    <HiDotsVertical size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {postMenu === post.id && (
                <div className="bg-white border border-gray-100 rounded-xl mb-3 overflow-hidden shadow-sm">
                  <button
                    onClick={() => { setReportPost(post.id); setPostMenu(null) }}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50"
                  >
                    Report Post
                  </button>
                </div>
              )}

              <p className="text-sm mb-3 leading-relaxed text-gray-700">
                {renderContent(post.content)}
              </p>

              <PollCard postId={post.id} />

              {post.media_url && (
                <div className="mb-3 rounded-2xl overflow-hidden mt-2">
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} controls className="w-full max-h-80 object-cover" />
                  ) : (
                    <img src={post.media_url} alt="post media" className="w-full max-h-80 object-cover" />
                  )}
                </div>
              )}

              <div className="flex gap-1 text-sm border-t pt-3 text-gray-500">
                <div className="flex items-center gap-1 flex-1">
                  <button
                    onClick={() => handleReact(post.id)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors ${post.liked ? 'text-[#2B4593] font-semibold' : 'text-gray-500'}`}
                  >
                    👍 <span className="text-xs">Like</span>
                  </button>
                  {parseInt(post.reaction_count) > 0 && (
                    <button
                      onClick={() => handleShowLiked(post.id)}
                      className="text-xs text-gray-400 hover:text-[#2B4593] hover:underline"
                    >
                      {post.reaction_count}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-1">
                  <button
                    onClick={() => handleAttempt(post.id)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors ${post.attempted ? 'text-[#2B4593] font-semibold' : 'text-gray-500'}`}
                  >
                    🙋 <span className="text-xs">Attempt</span>
                  </button>
                  {parseInt(post.attempted_count) > 0 && (
                    <button
                      onClick={() => handleShowAttempted(post.id)}
                      className="text-xs text-gray-400 hover:text-[#2B4593] hover:underline"
                    >
                      {post.attempted_count}
                    </button>
                  )}
                </div>

                <Link
                  to={`/post/${post.id}`}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex-1"
                >
                  💬 <span className="text-xs">Comment</span>
                  {parseInt(post.comment_count) > 0 && (
                    <span className="text-xs text-gray-400">{post.comment_count}</span>
                  )}
                </Link>

                <button
                  onClick={() => setSharePost(post)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex-1"
                >
                  ↗ <span className="text-xs">Share</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Who Liked Modal */}
      {(whoLiked || whoAttempted) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-sm p-6 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">
              {whoLiked ? 'People who Liked' : 'People who Attempted'}
            </h3>
            {peopleList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nobody yet</p>
            ) : (
              peopleList.map((person) => (
                <Link
                  to={`/user/${person.id}`}
                  key={person.id}
                  onClick={() => { setWhoLiked(null); setWhoAttempted(null) }}
                >
                  <div className="flex items-center gap-3 py-3 border-b border-gray-50">
                    {person.profile_photo ? (
                      <img src={person.profile_photo} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                        {person.full_name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{person.full_name}</p>
                      <p className="text-xs text-gray-400">@{person.username}</p>
                    </div>
                    {person.is_verified && (
                      <span className="text-xs bg-[#2B4593] text-white px-1.5 py-0.5 rounded-full ml-auto">✓</span>
                    )}
                  </div>
                </Link>
              ))
            )}
            <button
              onClick={() => { setWhoLiked(null); setWhoAttempted(null) }}
              className="w-full text-center py-3 text-sm text-red-400 font-semibold mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Share Post</h3>
            <button onClick={() => handleRepost(sharePost.id)} className="w-full text-left py-3 border-b border-gray-100 text-sm text-gray-700 hover:text-[#2B4593]">
              🔁 Repost on EP
            </button>
            <button onClick={() => handleCopyLink(sharePost.id)} className="w-full text-left py-3 border-b border-gray-100 text-sm text-gray-700 hover:text-[#2B4593]">
              🔗 Copy Link
            </button>
            <button onClick={() => handleShareWhatsApp(sharePost)} className="w-full text-left py-3 border-b border-gray-100 text-sm text-gray-700 hover:text-[#2B4593]">
              💬 Share via WhatsApp
            </button>
            <button onClick={() => setSharePost(null)} className="w-full text-center py-3 text-sm text-red-400 font-semibold mt-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {reportPost && (
        <ReportModal postId={reportPost} onClose={() => setReportPost(null)} />
      )}

      <BottomNav />
    </div>
  )
}

export default Home