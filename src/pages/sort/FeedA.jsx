import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiMenuAlt3 } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import { getFeedPosts } from '../../api/postAPI'

const categories = ['All', 'Technology', 'Education', 'Jobs & Internships', 'Projects', 'Research', 'Events', 'Achievements']

function FeedA() {
  const [posts, setPosts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [showCategories, setShowCategories] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeedPosts()
      .then((res) => {
        setPosts(res.data)
        setFiltered(res.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setShowCategories(false)
    if (cat === 'All') {
      setFiltered(posts)
      return
    }
    const keywords = {
      'Technology': ['tech', 'code', 'software', 'app', 'programming', 'developer', 'ai', 'machine'],
      'Education': ['study', 'learn', 'course', 'exam', 'university', 'college', 'school', 'degree'],
      'Jobs & Internships': ['job', 'intern', 'hiring', 'career', 'opportunity', 'work', 'employ'],
      'Projects': ['project', 'built', 'created', 'developed', 'launched', 'made'],
      'Research': ['research', 'paper', 'study', 'analysis', 'data', 'findings'],
      'Events': ['event', 'workshop', 'seminar', 'conference', 'hackathon', 'meetup'],
      'Achievements': ['achieved', 'won', 'award', 'congratulations', 'proud', 'milestone'],
    }
    const words = keywords[cat] || []
    setFiltered(posts.filter((p) =>
      words.some((w) => p.content?.toLowerCase().includes(w))
    ))
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 z-50 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">Students Feed</h1>
        <button onClick={() => setShowCategories(!showCategories)}>
          <HiMenuAlt3 size={24} className="text-[#2B4593]" />
        </button>
      </div>

      {showCategories && (
        <div className="fixed top-14 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl w-52 z-50 overflow-hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 ${activeCategory === cat ? 'text-[#2B4593] font-bold bg-[#2B4593]/5' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="pt-16 px-4">
        <p className="text-xs text-gray-400 mt-3 mb-2">
          {activeCategory === 'All' ? 'All posts' : activeCategory} · {filtered.length} posts
        </p>
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">No posts in this category</p>
        ) : (
          filtered.map((post) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-4 mt-3 shadow-sm">
              <Link to={`/user/${post.user_id}`}>
                <div className="flex items-center gap-3 mb-3">
                  {post.profile_photo ? (
                    <img src={post.profile_photo} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                      {post.full_name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-sm text-gray-800">{post.full_name}</p>
                      {post.is_verified && <span className="text-xs bg-[#2B4593] text-white px-1.5 py-0.5 rounded-full">✓</span>}
                    </div>
                    <p className="text-xs text-gray-400">@{post.username}</p>
                  </div>
                </div>
              </Link>
              <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
              {post.media_url && (
                <div className="mt-3 rounded-2xl overflow-hidden">
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} controls className="w-full max-h-80 object-cover" />
                  ) : (
                    <img src={post.media_url} alt="media" className="w-full max-h-80 object-cover" />
                  )}
                </div>
              )}
              <div className="flex gap-4 text-gray-400 text-sm border-t mt-3 pt-3">
                <button className="hover:text-[#2B4593]">👍 {post.reaction_count}</button>
                <button className="hover:text-[#2B4593]">🙋 {post.attempted_count || 0}</button>
                <Link to={`/post/${post.id}`} className="hover:text-[#2B4593]">💬 {post.comment_count}</Link>
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

export default FeedA