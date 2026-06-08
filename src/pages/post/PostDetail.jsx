import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiPaperAirplane, HiDotsVertical } from 'react-icons/hi'
import { getPost, getComments, addComment, addReply, deletePost, attemptPost, getAttempted } from '../../api/postAPI'
import { useAuth } from '../../context/AuthContext'

function PostDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const [replyInput, setReplyInput] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showAttempted, setShowAttempted] = useState(false)
  const [attemptedList, setAttemptedList] = useState([])

  useEffect(() => {
    Promise.all([getPost(id), getComments(id)])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data)
        setComments(commentsRes.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddComment = async () => {
    if (!commentInput.trim()) return
    try {
      const res = await addComment(id, commentInput)
      setComments([...comments, { ...res.data, full_name: user?.fullName, username: user?.username, replies: [] }])
      setCommentInput('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddReply = async (commentId) => {
    if (!replyInput.trim()) return
    try {
      const res = await addReply(commentId, replyInput)
      setComments(comments.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies || []), { ...res.data, full_name: user?.fullName, username: user?.username }] }
          : c
      ))
      setReplyInput('')
      setReplyingTo(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost(id)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  const handleAttempt = async () => {
    try {
      await attemptPost(id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleViewAttempted = async () => {
    try {
      const res = await getAttempted(id)
      setAttemptedList(res.data)
      setShowAttempted(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://ep-frontend-snowy.vercel.app/post/${id}`)
    alert('Link copied!')
  }

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=Check this post on EP: https://ep-frontend-snowy.vercel.app/post/${id}`, '_blank')
  }

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center justify-between">
        <Link to="/">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Post</h1>
        {post?.user_id === user?.id && (
          <button onClick={() => setShowMenu(!showMenu)}>
            <HiDotsVertical size={22} className="text-gray-400" />
          </button>
        )}
      </div>

      {showMenu && (
        <div className="fixed top-14 right-4 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          <Link to={`/post/edit/${id}`}>
            <div className="px-6 py-3 border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50">
              Edit Post
            </div>
          </Link>
          <button
            onClick={handleDelete}
            className="w-full px-6 py-3 text-sm text-red-500 text-left hover:bg-gray-50"
          >
            Delete Post
          </button>
        </div>
      )}

      <div className="pt-16 px-4">
        {post && (
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Link to={`/user/${post.user_id}`}>
                <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold">
                  {post.full_name?.charAt(0)}
                </div>
              </Link>
              <div>
                <p className="font-semibold text-sm text-gray-800">{post.full_name}</p>
                <p className="text-xs text-gray-400">@{post.username}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">{post.content}</p>
            <div className="flex gap-4 text-gray-400 text-sm border-t pt-3">
              <button className="hover:text-[#2B4593]">👍 Like</button>
              <button onClick={handleAttempt} className="hover:text-[#2B4593]">🙋 Attempted</button>
              {post.user_id === user?.id && (
                <button onClick={handleViewAttempted} className="hover:text-[#2B4593] text-xs">
                  👥 See who attempted
                </button>
              )}
              <button onClick={handleCopyLink} className="hover:text-[#2B4593]">🔗 Copy</button>
              <button onClick={handleShareWhatsApp} className="hover:text-[#2B4593]">↗ Share</button>
            </div>
          </div>
        )}

        <div className="py-4">
          <p className="text-sm font-bold text-gray-800 mb-4">Comments</p>
          {comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[#8EB3E7] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {comment.full_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-3 py-2">
                    <p className="text-xs font-semibold text-gray-800">{comment.full_name}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex gap-4 mt-1 ml-2">
                    <button className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</button>
                    <button onClick={() => setReplyingTo(comment.id)} className="text-xs text-gray-400 hover:text-[#2B4593]">Reply</button>
                  </div>

                  {comment.replies?.map((reply) => (
                    <div key={reply.id} className="flex gap-3 mt-3 ml-4">
                      <div className="w-7 h-7 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {reply.full_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="bg-gray-100 rounded-2xl px-3 py-2">
                          <p className="text-xs font-semibold text-gray-800">{reply.full_name}</p>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {replyingTo === comment.id && (
                    <div className="flex items-center gap-2 mt-3 ml-4">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm focus:outline-none"
                      />
                      <button onClick={() => handleAddReply(comment.id)}>
                        <HiPaperAirplane size={18} className="text-[#2B4593] rotate-90" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attempted List Modal */}
      {showAttempted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-sm p-6 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">People who Attempted</h3>
            {attemptedList.length === 0 ? (
              <p className="text-sm text-gray-400">Nobody attempted yet</p>
            ) : (
              attemptedList.map((a) => (
                <Link to={`/user/${a.user_id}`} key={a.id} onClick={() => setShowAttempted(false)}>
                  <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                      {a.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{a.full_name}</p>
                      <p className="text-xs text-gray-400">@{a.username}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
            <button
              onClick={() => setShowAttempted(false)}
              className="w-full text-center py-3 text-sm text-red-400 font-semibold mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
          {user?.fullName?.charAt(0)}
        </div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button onClick={handleAddComment}>
          <HiPaperAirplane size={20} className="text-[#2B4593] rotate-90" />
        </button>
      </div>
    </div>
  )
}

export default PostDetail