import { useState, useEffect } from 'react'
import { HiMenuAlt3 } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import { getFeedPosts } from '../../api/postAPI'

const categories = ['All', 'Agriculture', 'Transport', 'Handicrafts', 'Local Trade', 'Food', 'Health']

function FeedB() {
  const [posts, setPosts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [showCategories, setShowCategories] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeedPosts()
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Public Feed</h1>
        <button onClick={() => setShowCategories(!showCategories)}>
          <HiMenuAlt3 size={24} className="text-[#2B4593]" />
        </button>
      </div>

      {showCategories && (
        <div className="fixed top-14 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl w-48 z-50 overflow-hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowCategories(false) }}
              className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 ${activeCategory === cat ? 'text-[#2B4593] font-bold' : 'text-gray-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="pt-16 px-4">
        <p className="text-xs text-gray-400 mt-3 mb-2">Showing: {activeCategory}</p>
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-4 mt-3 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#8EB3E7] flex items-center justify-center text-white font-bold text-sm">
                  {post.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{post.full_name}</p>
                  <p className="text-xs text-gray-400">@{post.username}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{post.content}</p>
              <div className="flex gap-4 text-gray-400 text-sm border-t mt-3 pt-3">
                <button className="hover:text-[#2B4593]">👍 {post.reaction_count}</button>
                <button className="hover:text-[#2B4593]">🙋 Attempted</button>
                <button className="hover:text-[#2B4593]">💬 {post.comment_count}</button>
                <button className="hover:text-[#2B4593]">↗ Share</button>
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export default FeedB