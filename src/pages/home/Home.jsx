import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiSearch, HiPencilAlt } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import ThemeToggle from '../../components/layout/ThemeToggle'
import { getFeedPosts, reactToPost, attemptPost } from '../../api/postAPI'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sharePost, setSharePost] = useState(null)
  const { user } = useAuth()
  const { darkMode } = useTheme()

  useEffect(() => {
    getFeedPosts()
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleReact = async (postId, type) => {
    try {
      await reactToPost(postId, type)
      setPosts(posts.map((p) =>
        p.id === postId
          ? { ...p, reaction_count: String(parseInt(p.reaction_count) + 1) }
          : p
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAttempt = async (postId) => {
    try {
      await attemptPost(postId)
      setPosts(posts.map((p) =>
        p.id === postId
          ? { ...p, attempted: !p.attempted }
          : p
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleShare = (post) => {
    setSharePost(post)
  }

  const handleCopyLink = (postId) => {
    navigator.clipboard.writeText(`https://ep-frontend-snowy.vercel.app/post/${postId}`)
    setSharePost(null)
    alert('Link copied!')
  }

  const handleShareWhatsApp = (post) => {
    const url = `https://wa.me/?text=Check this post on EP: https://ep-frontend-snowy.vercel.app/post/${post.id}`
    window.open(url, '_blank')
    setSharePost(null)
  }

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`fixed top-0 left-0 right-0 border-b px-4 py-3 flex items-center justify-between z-50 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h1 className="text-2xl font-black text-[#2B4593]">EP</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/explore">
            <HiSearch size={24} className={darkMode ? 'text-gray-300' : 'text-gray-500'} />
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
          <p className="text-center text-gray-400 text-sm mt-10">No posts yet. Connect with people to see their posts!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={`border rounded-2xl p-4 mt-4 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Link to={`/user/${post.user_id}`}>
                  <div className="w-10 h-10 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                    {post.full_name?.charAt(0)}
                  </div>
                </Link>
                <div>
                  <div className="flex items-center gap-1">
                    <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{post.full_name}</p>
                    {post.is_verified && <span className="text-xs bg-[#2B4593] text-white px-1.5 py-0.5 rounded-full">✓</span>}
                  </div>
                  <p className="text-xs text-gray-400">@{post.username}</p>
                </div>
              </div>
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{post.content}</p>
              <div className={`flex gap-4 text-sm border-t pt-3 ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-400'}`}>
                <button onClick={() => handleReact(post.id, 'like')} className="hover:text-[#2B4593]">
                  👍 {post.reaction_count}
                </button>
                <button
                  onClick={() => handleAttempt(post.id)}
                  className={`${post.attempted ? 'text-[#2B4593]' : ''} hover:text-[#2B4593]`}
                >
                  🙋 {post.attempted ? 'Attempted' : 'Attempt'}
                </button>
                <Link to={`/post/${post.id}`} className="hover:text-[#2B4593]">
                  💬 {post.comment_count}
                </Link>
                <button onClick={() => handleShare(post)} className="hover:text-[#2B4593]">
                  ↗ Share
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Share Modal */}
      {sharePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Share Post</h3>
            <button
              onClick={() => handleCopyLink(sharePost.id)}
              className="w-full text-left py-3 border-b border-gray-100 text-sm text-gray-700 hover:text-[#2B4593]"
            >
              🔗 Copy Link
            </button>
            <button
              onClick={() => handleShareWhatsApp(sharePost)}
              className="w-full text-left py-3 border-b border-gray-100 text-sm text-gray-700 hover:text-[#2B4593]"
            >
              💬 Share via WhatsApp
            </button>
            <button
              onClick={() => setSharePost(null)}
              className="w-full text-center py-3 text-sm text-red-400 font-semibold mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

export default Home