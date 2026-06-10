import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiShieldCheck, HiMail, HiIdentification } from 'react-icons/hi'
import API from '../../api/axios'
import { uploadMedia } from '../../api/mediaAPI'

function Verification() {
  const [method, setMethod] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Method 1 - Institutional email
  const [institutionalEmail, setInstitutionalEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  // Method 2 - ID card
  const [college, setCollege] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [idPhoto, setIdPhoto] = useState(null)
  const [uploading, setUploading] = useState(false)

  const isInstitutionalEmail = (email) => {
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    const domain = email.split('@')[1]
    return domain && !personalDomains.includes(domain)
  }

  const handleEmailVerification = async () => {
    if (!institutionalEmail.includes('@')) {
      setEmailError('Please enter a valid email')
      return
    }
    if (!isInstitutionalEmail(institutionalEmail)) {
      setEmailError('Please use your institutional email (not Gmail, Yahoo etc.)')
      return
    }
    setLoading(true)
    try {
      await API.post('/auth/verify-student', {
        method: 'email',
        institutionalEmail,
      })
      setSubmitted(true)
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  const handleIdUpload = async (file) => {
    setUploading(true)
    try {
      const res = await uploadMedia(file)
      setIdPhoto(res.data.url)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleIdVerification = async () => {
    if (!college || !idNumber) return
    setLoading(true)
    try {
      await API.post('/auth/verify-student', {
        method: 'id_card',
        college,
        idNumber,
        idPhoto,
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Student Verification</h1>
      </div>

      <div className="pt-16 px-4 pb-10">
        {submitted ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <HiShieldCheck size={60} className="text-[#2B4593] mb-4" />
            <p className="text-lg font-bold text-gray-800">Request Submitted!</p>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">
              Your verification is under review. We'll notify you once it's approved. This usually takes 1-2 business days.
            </p>
            <Link to="/profile" className="mt-6 bg-[#2B4593] text-white px-6 py-2 rounded-full text-sm font-semibold">
              Back to Profile
            </Link>
          </div>
        ) : !method ? (
          <>
            <div className="py-6 border-b border-gray-100 mb-6">
              <HiShieldCheck size={40} className="text-[#2B4593] mb-3" />
              <p className="font-bold text-gray-800 mb-1">Get Student Verified</p>
              <p className="text-xs text-gray-400">
                Choose your preferred verification method. Verified students get exclusive benefits on EP.
              </p>
            </div>

            <p className="text-sm font-semibold text-gray-600 mb-4">Choose verification method:</p>

            <button
              onClick={() => setMethod('email')}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-[#2B4593] transition-colors mb-3 text-left"
            >
              <div className="w-12 h-12 rounded-full bg-[#2B4593]/10 flex items-center justify-center flex-shrink-0">
                <HiMail size={24} className="text-[#2B4593]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Institutional Email</p>
                <p className="text-xs text-gray-400 mt-0.5">Use your college/university email address</p>
                <p className="text-xs text-green-500 mt-0.5">✓ Instant verification</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('id')}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-[#2B4593] transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-[#2B4593]/10 flex items-center justify-center flex-shrink-0">
                <HiIdentification size={24} className="text-[#2B4593]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Student ID Card</p>
                <p className="text-xs text-gray-400 mt-0.5">Upload a photo of your student ID</p>
                <p className="text-xs text-yellow-500 mt-0.5">⏱ Takes 1-2 business days</p>
              </div>
            </button>
          </>
        ) : method === 'email' ? (
          <div>
            <button onClick={() => setMethod(null)} className="flex items-center gap-1 text-sm text-gray-400 mb-6">
              ← Back
            </button>
            <HiMail size={40} className="text-[#2B4593] mb-3" />
            <p className="font-bold text-gray-800 mb-1">Institutional Email</p>
            <p className="text-xs text-gray-400 mb-6">
              Enter your college or university email. We'll verify it's a valid institutional address.
            </p>
            {emailError && <p className="text-sm text-red-500 mb-3">{emailError}</p>}
            <input
              type="email"
              placeholder="e.g. alan@sjcetpalai.ac.in"
              value={institutionalEmail}
              onChange={(e) => { setInstitutionalEmail(e.target.value); setEmailError('') }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] mb-4"
            />
            <button
              onClick={handleEmailVerification}
              disabled={loading || !institutionalEmail}
              className="w-full bg-[#2B4593] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Verify Email'}
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => setMethod(null)} className="flex items-center gap-1 text-sm text-gray-400 mb-6">
              ← Back
            </button>
            <HiIdentification size={40} className="text-[#2B4593] mb-3" />
            <p className="font-bold text-gray-800 mb-1">Student ID Card</p>
            <p className="text-xs text-gray-400 mb-6">
              Fill in your details and upload a clear photo of your student ID card.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="College / University Name"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
              />
              <input
                type="text"
                placeholder="Student ID Number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
              />
              <div>
                <p className="text-xs text-gray-400 mb-2">Upload ID Card Photo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIdUpload(e.target.files[0])}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
                />
                {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
                {idPhoto && <p className="text-xs text-green-500 mt-1">✓ Photo uploaded</p>}
              </div>
            </div>
            <button
              onClick={handleIdVerification}
              disabled={loading || !college || !idNumber}
              className="w-full bg-[#2B4593] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 mt-4"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Verification