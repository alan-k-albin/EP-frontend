import { useState } from 'react'
import { HiSearch } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import BottomNav from '../../components/layout/BottomNav'
import { search } from '../../api/searchAPI'

function Explore() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ users: [], posts: [], hashtags: [] })
  const [activeTab, setActiveTab] = useState('people')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (value) => {
    setQuery(value)
    if (value.trim() === '') {
      setResults({ users: [], posts: [], hashtags: [] })
      return
    }
    setLoading(true)
    try {
      const res = await search(value)
      setResults(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
          <HiSearch size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search people, posts, hashtags..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-transparent text-sm flex-1 focus:outline-none text-gray-700"
          />
        </div>
        <div className="flex gap-4 mt-3">
          {['people', 'posts', 'hashtags'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold capitalize pb-1 ${activeTab === tab ? 'text-[#2B4593] border-b-2 border-[#2B4593]' : 'text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-28 px-4">
        {loading && <p className="text-center text-gray-400 text-sm mt-10">Searching...</p>}

        {!loading && activeTab === 'people' && results.users.map((user) => (
          <Link to={`/user/${user.id}`} key={user.id}>
            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold">
                {user.full_name?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-gray-800">{user.full_name}</p>
                  {user.is_verified && <span className="text-xs bg-[#2B4593] text-white px-1.5 py-0.5 rounded-full">✓</span>}
                </div>
                <p className="text-xs text-gray-400">@{user.username}</p>
                {user.college && <p className="text-xs text-gray-400">{user.college}</p>}
              </div>
            </div>
          </Link>
        ))}

        {!loading && activeTab === 'posts' && results.posts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id}>
            <div className="py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{post.full_name}</p>
              <p className="text-sm text-gray-600 mt-1">{post.content}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}

        {!loading && activeTab === 'hashtags' && results.hashtags.map((tag) => (
          <div key={tag.id} className="py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-[#2B4593]">#{tag.name}</p>
          </div>
        ))}

        {!loading && query === '' && (
          <p className="text-center text-gray-400 text-sm mt-10">Search for people, posts or hashtags</p>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export default Explore