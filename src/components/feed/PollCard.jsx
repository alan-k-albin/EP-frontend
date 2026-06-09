import { useState, useEffect } from 'react'
import { getPoll, votePoll } from '../../api/pollAPI'

function PollCard({ postId }) {
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  useEffect(() => {
    getPoll(postId)
      .then((res) => setPoll(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [postId])

  const handleVote = async (optionId) => {
    if (poll?.userVoted || voting) return
    setVoting(true)
    try {
      await votePoll(optionId)
      const res = await getPoll(postId)
      setPoll(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setVoting(false)
    }
  }

  if (loading || !poll) return null

  return (
    <div className="mt-3 border border-gray-100 rounded-2xl p-4 bg-gray-50">
      <p className="text-xs font-semibold text-gray-500 mb-3">Poll · {poll.totalVotes} votes</p>
      {poll.options.map((option) => {
        const percentage = poll.totalVotes > 0
          ? Math.round((parseInt(option.vote_count) / poll.totalVotes) * 100)
          : 0
        return (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={poll.userVoted}
            className="w-full mb-2 text-left"
          >
            <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-white">
              {poll.userVoted && (
                <div
                  className="absolute top-0 left-0 h-full bg-[#2B4593]/10 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              )}
              <div className="relative flex items-center justify-between px-4 py-3">
                <p className={`text-sm ${option.user_voted ? 'font-semibold text-[#2B4593]' : 'text-gray-700'}`}>
                  {option.option_text}
                </p>
                {poll.userVoted && (
                  <p className="text-xs font-semibold text-[#2B4593]">{percentage}%</p>
                )}
              </div>
            </div>
          </button>
        )
      })}
      {!poll.userVoted && (
        <p className="text-xs text-gray-400 mt-2 text-center">Tap to vote</p>
      )}
    </div>
  )
}

export default PollCard