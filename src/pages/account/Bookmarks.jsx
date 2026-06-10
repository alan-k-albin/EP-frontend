import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import { getBookmarks } from '../../api/postAPI'

function Bookmarks() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBookmarks()
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/profile">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Saved Posts</h1>
      </div>

      <div className="pt-16 px-4">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">No saved posts yet</p>
        ) : (
          posts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id}>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 mt-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  {post.profile_photo ? (
                    <img src={post.profile_photo} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                      {post.full_name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{post.full_name}</p>
                    <p className="text-xs text-gray-400">@{post.username}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                {post.media_url && (
                  post.media_type === 'video' ? (
                    <video src={post.media_url} className="w-full max-h-48 object-cover rounded-xl mt-2" />
                  ) : (
                    <img src={post.media_url} alt="media" className="w-full max-h-48 object-cover rounded-xl mt-2" />
                  )
                )}
                <div className="flex gap-4 text-gray-400 text-sm border-t mt-3 pt-3">
                  <span>👍 {post.reaction_count}</span>
                  <span>🙋 {post.attempted_count}</span>
                  <span>💬 {post.comment_count}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export default Bookmarks