import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiSearch, HiPencilAlt, HiDotsVertical, HiBookmark } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import ReportModal from '../../components/common/ReportModal'
import PollCard from '../../components/feed/PollCard'
import { getFeedPosts, reactToPost, attemptPost, bookmarkPost, repostPost } from '../../api/postAPI'
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
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getFeedPosts()
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleReact = async (e, postId) => {
    e.stopPropagation()
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

  const handleAttempt = async (e, postId) => {
    e.stopPropagation()
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

  const handleBookmark = async (e, postId) => {
    e.stopPropagation()
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

  const handleShareInChat = (post) => {
    setSharePost(null)
    navigate(`/chat?sharePost=${post.id}`)
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
            <div
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              className="bg-white border border-gray-100 rounded-2xl p-4 mt-4 shadow-sm cursor-pointer active:bg-gray-50 transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
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
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={(e) => handleBookmark(e, post.id)}>
                    <HiBookmark size={18} className={post.bookmarked ? 'text-[#2B4593]' : 'text-gray-300'} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setPostMenu(postMenu === post.id ? null : post.id) }}>
                    <HiDotsVertical size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Post Menu */}
              {postMenu === post.id && (
                <div
                  className="bg-white border border-gray-100 rounded-xl mb-3 overflow-hidden shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setReportPost(post.id); setPostMenu(null) }}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50"
                  >
                    Report Post
                  </button>
                </div>
              )}

              {/* Post Content */}
              <p className="text-sm mb-3 leading-relaxed text-gray-700">
                {renderContent(post.content)}
              </p>

              {/* Poll */}
              <div onClick={(e) => e.stopPropagation()}>
                <PollCard postId={post.id} />
              </div>

              {/* Media */}
              {post.media_url && (
                <div className="mb-3 rounded-2xl overflow-hidden mt-2">
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} controls className="w-full max-h-80 object-cover" onClick={(e) => e.stopPropagation()} />
                  ) : (
                    <img src={post.media_url} alt="post media" className="w-full max-h-80 object-cover" />
                  )}
                </div>
              )}

              {/* Actions */}
              <div
                className="flex items-center gap-1 text-sm border-t pt-3 text-gray-500"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Like */}
                <button
                  onClick={(e) => handleReact(e, post.id)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors ${post.liked ? 'text-[#2B4593] font-semibold' : 'text-gray-500'}`}
                >
                  👍
                  <span className="text-xs">Like</span>
                  {parseInt(post.reaction_count) > 0 && (
                    <span className={`text-xs ${post.liked ? 'text-[#2B4593]' : 'text-gray-400'}`}>
                      {post.reaction_count}
                    </span>
                  )}
                </button>

                {/* Attempt */}
                <button
                  onClick={(e) => handleAttempt(e, post.id)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors ${post.attempted ? 'text-[#2B4593] font-semibold' : 'text-gray-500'}`}
                >
                  🙋
                  <span className="text-xs">Attempt</span>
                  {parseInt(post.attempted_count) > 0 && (
                    <span className={`text-xs ${post.attempted ? 'text-[#2B4593]' : 'text-gray-400'}`}>
                      {post.attempted_count}
                    </span>
                  )}
                </button>

                {/* Comment */}
                <button
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                >
                  💬
                  <span className="text-xs">Comment</span>
                  {parseInt(post.comment_count) > 0 && (
                    <span className="text-xs text-gray-400">{post.comment_count}</span>
                  )}
                </button>

                {/* Share */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSharePost(post) }}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                >
                  ↗ <span className="text-xs">Share</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Share Modal */}
      {sharePost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
          onClick={() => setSharePost(null)}
        >
          <div
            className="bg-white rounded-t-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-800 mb-4">Share Post</h3>
            <button onClick={() => handleRepost(sharePost.id)} className="w-full text-left py-3 border-b border-gray-100 text-sm text-gray-700 hover:text-[#2B4593]">
              🔁 Repost on EP
            </button>
            <button onClick={() => handleShareInChat(sharePost)} className="w-full text-left py-3 border-b border-gray-100 text-sm text-gray-700 hover:text-[#2B4593]">
              💬 Send in Chat
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

      {/* Report Modal */}
      {reportPost && (
        <ReportModal postId={reportPost} onClose={() => setReportPost(null)} />
      )}

      <BottomNav />
    </div>
  )
}

export default Home