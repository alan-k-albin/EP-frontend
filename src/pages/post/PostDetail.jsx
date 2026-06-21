import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiPaperAirplane, HiDotsVertical } from 'react-icons/hi'
import {
  getPost, getComments, addComment, addReply, deletePost,
  reactToPost, attemptPost, getWhoLiked, getWhoAttempted
} from '../../api/postAPI'
import { useAuth } from '../../context/AuthContext'
import PollCard from '../../components/feed/PollCard'

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
  const [activeList, setActiveList] = useState(null) // 'liked' | 'attempted' | null
  const [peopleList, setPeopleList] = useState([])
  const [peopleLoading, setPeopleLoading] = useState(false)

  useEffect(() => {
    Promise.all([getPost(id), getComments(id)])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data)
        setComments(commentsRes.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleLike = async () => {
    try {
      const res = await reactToPost(id, 'like')
      setPost((prev) => ({
        ...prev,
        liked: res.data.liked,
        reaction_count: res.data.count,
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAttempt = async () => {
    try {
      const res = await attemptPost(id)
      setPost((prev) => ({
        ...prev,
        attempted: res.data.attempted,
        attempted_count: res.data.count,
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleShowLiked = async () => {
    if (parseInt(post?.reaction_count) === 0) return
    if (activeList === 'liked') { setActiveList(null); return }
    setPeopleLoading(true)
    setActiveList('liked')
    try {
      const res = await getWhoLiked(id)
      setPeopleList(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setPeopleLoading(false)
    }
  }

  const handleShowAttempted = async () => {
    if (parseInt(post?.attempted_count) === 0) return
    if (activeList === 'attempted') { setActiveList(null); return }
    setPeopleLoading(true)
    setActiveList('attempted')
    try {
      const res = await getWhoAttempted(id)
      setPeopleList(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setPeopleLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!commentInput.trim()) return
    try {
      const res = await addComment(id, commentInput)
      setComments([...comments, {
        ...res.data,
        full_name: user?.fullName,
        username: user?.username,
        replies: []
      }])
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://ep-app.vercel.app/post/${id}`)
    alert('Link copied!')
  }

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=Check this post on EP: https://ep-app.vercel.app/post/${id}`, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <HiArrowLeft size={22} className="text-gray-500" />
        </button>
        <h1 className="text-base font-semibold text-gray-800">Post</h1>
        {post?.user_id === user?.id ? (
          <button onClick={() => setShowMenu(!showMenu)}>
            <HiDotsVertical size={22} className="text-gray-400" />
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>

      {/* Post Owner Menu */}
      {showMenu && (
        <div className="fixed top-14 right-4 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          <Link to={`/post/edit/${id}`}>
            <div className="px-6 py-3 border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50">
              Edit Post
            </div>
          </Link>
          <button onClick={handleDelete} className="w-full px-6 py-3 text-sm text-red-500 text-left hover:bg-gray-50">
            Delete Post
          </button>
        </div>
      )}

      <div className="pt-16 px-4">
        {post && (
          <div className="py-4 border-b border-gray-100">
            {/* Author */}
            <div className="flex items-center gap-3 mb-3">
              <Link to={`/user/${post.user_id}`}>
                {post.profile_photo ? (
                  <img src={post.profile_photo} alt="avatar" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold">
                    {post.full_name?.charAt(0)}
                  </div>
                )}
              </Link>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-sm text-gray-800">{post.full_name}</p>
                  {post.is_verified && (
                    <span className="text-xs bg-[#2B4593] text-white px-1.5 py-0.5 rounded-full">✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">@{post.username}</p>
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{post.content}</p>

            {/* Poll */}
            <PollCard postId={post.id} />

            {/* Media */}
            {post.media_url && (
              <div className="mt-3 rounded-2xl overflow-hidden">
                {post.media_type === 'video' ? (
                  <video src={post.media_url} controls className="w-full max-h-80 object-cover" />
                ) : (
                  <img src={post.media_url} alt="media" className="w-full max-h-80 object-cover" />
                )}
              </div>
            )}

            {/* Counts row — clickable, toggles inline list */}
            {(parseInt(post.reaction_count) > 0 || parseInt(post.attempted_count) > 0) && (
              <div className="flex gap-4 mt-3 pb-2 border-b border-gray-100">
                {parseInt(post.reaction_count) > 0 && (
                  <button
                    onClick={handleShowLiked}
                    className={`text-xs font-medium transition-colors ${activeList === 'liked' ? 'text-[#2B4593]' : 'text-gray-400 hover:text-[#2B4593]'}`}
                  >
                    👍 {post.reaction_count} {parseInt(post.reaction_count) === 1 ? 'Like' : 'Likes'}
                  </button>
                )}
                {parseInt(post.attempted_count) > 0 && (
                  <button
                    onClick={handleShowAttempted}
                    className={`text-xs font-medium transition-colors ${activeList === 'attempted' ? 'text-[#2B4593]' : 'text-gray-400 hover:text-[#2B4593]'}`}
                  >
                    🙋 {post.attempted_count} {parseInt(post.attempted_count) === 1 ? 'Attempt' : 'Attempts'}
                  </button>
                )}
              </div>
            )}

            {/* Inline people list — expands on page like LinkedIn */}
            {activeList && (
              <div className="border-b border-gray-100 pb-2">
                {peopleLoading ? (
                  <p className="text-xs text-gray-400 py-3 text-center">Loading...</p>
                ) : (
                  peopleList.map((person) => (
                    <Link
                      to={`/user/${person.id}`}
                      key={person.id}
                      onClick={() => setActiveList(null)}
                    >
                      <div className="flex items-center gap-3 py-2.5 hover:bg-gray-50 rounded-xl px-2 transition-colors">
                        {person.profile_photo ? (
                          <img src={person.profile_photo} alt="avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {person.full_name?.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{person.full_name}</p>
                          <p className="text-xs text-gray-400">@{person.username}</p>
                        </div>
                        {person.is_verified && (
                          <span className="text-xs bg-[#2B4593] text-white px-1.5 py-0.5 rounded-full flex-shrink-0">✓</span>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-1 text-sm mt-2 pt-2 text-gray-500">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center ${post.liked ? 'text-[#2B4593] font-semibold' : 'text-gray-500'}`}
              >
                👍 <span className="text-xs">Like</span>
              </button>

              <button
                onClick={handleAttempt}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center ${post.attempted ? 'text-[#2B4593] font-semibold' : 'text-gray-500'}`}
              >
                🙋 <span className="text-xs">Attempt</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex-1 justify-center"
              >
                🔗 <span className="text-xs">Copy</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex-1 justify-center"
              >
                ↗ <span className="text-xs">Share</span>
              </button>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="py-4">
          <p className="text-sm font-bold text-gray-800 mb-4">Comments</p>
          {comments.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No comments yet. Be the first!</p>
          )}
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
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-xs text-gray-400 hover:text-[#2B4593]"
                    >
                      Reply
                    </button>
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

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3">
        {user?.profilePhoto ? (
          <img src={user.profilePhoto} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.charAt(0)}
          </div>
        )}
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
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