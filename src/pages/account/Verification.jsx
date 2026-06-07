import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiShieldCheck } from 'react-icons/hi'

function Verification() {
  const [college, setCollege] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [file, setFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!college || !idNumber) return
    setSubmitted(true)
    console.log('Verification request:', { college, idNumber, file })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Student Verification</h1>
      </div>

      <div className="pt-16 px-4 pb-10">

        {submitted ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <HiShieldCheck size={60} className="text-[#2B4593] mb-4" />
            <p className="text-lg font-bold text-gray-800">Request Submitted!</p>
            <p className="text-sm text-gray-400 text-center mt-2">
              Your verification is under review. We'll notify you once it's approved.
            </p>
          </div>
        ) : (
          <>
            <div className="py-6 border-b border-gray-100">
              <HiShieldCheck size={40} className="text-[#2B4593] mb-3" />
              <p className="text-sm font-bold text-gray-800 mb-1">Get Verified as a Student</p>
              <p className="text-xs text-gray-400">
                Submit your college ID details to get the verified badge on your profile.
              </p>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1 font-semibold">College / University Name</p>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. St. Joseph's College of Engineering"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
                />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1 font-semibold">Student ID Number</p>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. ECE2024001"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
                />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1 font-semibold">Upload College ID (optional)</p>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#2B4593] text-white rounded-xl py-3 text-sm font-semibold mt-2"
              >
                Submit for Verification
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Verification