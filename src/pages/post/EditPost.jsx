import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import { getPost, updatePost } from '../../api/postAPI'
import { useAuth } from '../../context/AuthContext'

function EditPost() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPost(id)
      .then((res) => {
        if (res.data.user_id !== user?.id) {
          navigate('/')
          return
        }
        setContent(res.data.content)
      })
      .catch((err) => console.error(err))
      .finally(() => setFetching(false))
  }, [id])

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Post cannot be empty')
      return
    }
    setLoading(true)
    try {
      await updatePost(id, { content })
      navigate(`/post/${id}`)
    } catch (err) {
      setError('Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <p className="text-center mt-20 text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 z-50 flex items-center justify-between">
        <Link to={`/post/${id}`}>
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Edit Post</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#2B4593] text-white text-sm font-semibold px-5 py-1.5 rounded-full disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="pt-16 px-4 py-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold">
            {user?.fullName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{user?.fullName}</p>
            <p className="text-xs text-gray-400">@{user?.username}</p>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full text-sm text-gray-800 focus:outline-none resize-none leading-relaxed"
        />
      </div>
    </div>
  )
}

export default EditPost