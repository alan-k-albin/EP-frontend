import { useState } from 'react'
import { HiX } from 'react-icons/hi'
import API from '../../api/axios'

const reasons = [
  'Spam or misleading',
  'Harassment or bullying',
  'Hate speech',
  'Violence or dangerous content',
  'False information',
  'Other',
]

function ReportModal({ postId, userId, onClose }) {
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!reason) return
    setLoading(true)
    try {
      await API.post('/users/report', {
        reportedPostId: postId || null,
        reportedUserId: userId || null,
        reason,
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Report</h3>
          <button onClick={onClose}>
            <HiX size={20} className="text-gray-400" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold text-gray-800">Report Submitted</p>
            <p className="text-sm text-gray-400 mt-1">Thank you for keeping EP safe</p>
            <button onClick={onClose} className="mt-4 bg-[#2B4593] text-white px-6 py-2 rounded-full text-sm font-semibold">
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">Why are you reporting this?</p>
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm mb-2 border transition-colors ${
                  reason === r ? 'border-[#2B4593] bg-[#2B4593]/5 text-[#2B4593] font-semibold' : 'border-gray-100 text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
            <button
              onClick={handleSubmit}
              disabled={!reason || loading}
              className="w-full bg-red-500 text-white py-3 rounded-xl text-sm font-semibold mt-2 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ReportModal