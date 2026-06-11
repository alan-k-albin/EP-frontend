import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiShieldCheck, HiMail, HiIdentification } from 'react-icons/hi'
import API from '../../api/axios'
import { uploadMedia } from '../../api/mediaAPI'
import { useAuth } from '../../context/AuthContext'

const INSTITUTIONAL_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.(ac\.in|edu|ac\.uk|edu\.au|ac\.nz|edu\.in|ac\.za|edu\.sg|ac\.lk|edu\.pk|ac\.bd)$/i

function Verification() {
  const { updateUser } = useAuth()
  const navigate = useNavigate()
  const [method, setMethod] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [institutionalEmail, setInstitutionalEmail] = useState('')
  const [college, setCollege] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [idPhoto, setIdPhoto] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleEmailVerification = async () => {
    setError('')
    if (!institutionalEmail) {
      setError('Please enter your institutional email')
      return
    }
    if (!INSTITUTIONAL_EMAIL_REGEX.test(institutionalEmail)) {
      setError('Please use a valid institutional email (e.g. yourname@college.ac.in or @university.edu)')
      return
    }
    setLoading(true)
    try {
      const res = await API.post('/auth/verify-student', { method: 'email', institutionalEmail })
      if (res.data.verified) {
        setVerified(true)
        updateUser({ isVerified: true })
      }
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
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
    setError('')
    if (!college || !idNumber) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      await API.post('/auth/verify-student', { method: 'id_card', college, idNumber, idPhoto })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center gap-3">
        <button onClick={() => method ? setMethod(null) : navigate('/settings')}>
          <HiArrowLeft size={22} className="text-gray-500" />
        </button>
        <h1 className="text-base font-semibold text-gray-800">Student Verification</h1>
      </div>

      <div className="pt-16 px-4 pb-10">
        {submitted ? (
          <div className="flex flex-col items-center justify-center mt-16 text-center px-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${verified ? 'bg-green-100' : 'bg-[#2B4593]/10'}`}>
              <HiShieldCheck size={40} className={verified ? 'text-green-500' : 'text-[#2B4593]'} />
            </div>
            <p className="text-xl font-bold text-gray-800 mb-2">
              {verified ? '🎉 Verified!' : 'Request Submitted!'}
            </p>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              {verified
                ? 'Congratulations! Your account is now verified. The ✓ badge will appear on your profile.'
                : 'Your ID card is under review. We\'ll notify you within 1-2 business days.'
              }
            </p>
            <Link
              to="/profile"
              className="mt-6 bg-[#2B4593] text-white px-8 py-3 rounded-xl text-sm font-semibold"
            >
              View Profile
            </Link>
          </div>
        ) : !method ? (
          <>
            <div className="py-6 mb-4">
              <div className="w-16 h-16 bg-[#2B4593]/10 rounded-full flex items-center justify-center mb-4">
                <HiShieldCheck size={32} className="text-[#2B4593]" />
              </div>
              <p className="font-bold text-gray-800 text-lg mb-1">Get Student Verified</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Verified students get a ✓ badge on EP and access to exclusive student benefits.
              </p>
            </div>

            <p className="text-sm font-semibold text-gray-600 mb-4">Choose your verification method:</p>

            <button
              onClick={() => setMethod('email')}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-[#2B4593] transition-colors mb-3 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <HiMail size={24} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">Institutional Email</p>
                <p className="text-xs text-gray-400 mt-0.5">Use your college or university email</p>
                <p className="text-xs text-green-500 font-medium mt-1">⚡ Instant verification</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('id')}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-[#2B4593] transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <HiIdentification size={24} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">Student ID Card</p>
                <p className="text-xs text-gray-400 mt-0.5">Upload a photo of your student ID</p>
                <p className="text-xs text-orange-500 font-medium mt-1">⏱ 1-2 business days</p>
              </div>
            </button>
          </>
        ) : method === 'email' ? (
          <div className="mt-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <HiMail size={24} className="text-blue-500" />
            </div>
            <p className="font-bold text-gray-800 mb-1">Institutional Email</p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Enter your college or university email address. We support .ac.in, .edu, .ac.uk and other institutional domains.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <div className="mb-2">
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Institutional Email *</p>
              <input
                type="email"
                placeholder="yourname@college.ac.in"
                value={institutionalEmail}
                onChange={(e) => { setInstitutionalEmail(e.target.value); setError('') }}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${
                  institutionalEmail && !INSTITUTIONAL_EMAIL_REGEX.test(institutionalEmail)
                    ? 'border-red-300 focus:border-red-400'
                    : 'border-gray-200 focus:border-[#2B4593]'
                }`}
              />
              {institutionalEmail && !INSTITUTIONAL_EMAIL_REGEX.test(institutionalEmail) && (
                <p className="text-xs text-red-400 mt-1">
                  Please use a valid institutional email (not Gmail, Yahoo, Hotmail etc.)
                </p>
              )}
              {institutionalEmail && INSTITUTIONAL_EMAIL_REGEX.test(institutionalEmail) && (
                <p className="text-xs text-green-500 mt-1">✓ Valid institutional email</p>
              )}
            </div>

            <button
              onClick={handleEmailVerification}
              disabled={loading || !institutionalEmail || !INSTITUTIONAL_EMAIL_REGEX.test(institutionalEmail)}
              className="w-full bg-[#2B4593] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40 mt-4"
            >
              {loading ? 'Verifying...' : 'Verify Instantly'}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
              <HiIdentification size={24} className="text-orange-500" />
            </div>
            <p className="font-bold text-gray-800 mb-1">Student ID Card</p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Fill in your details and upload a clear photo of your student ID card for manual review.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1.5 font-medium">College / University *</p>
                <input
                  type="text"
                  placeholder="e.g. St. Joseph's College of Engineering"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1.5 font-medium">Student ID Number *</p>
                <input
                  type="text"
                  placeholder="e.g. ECE2024001"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1.5 font-medium">ID Card Photo (optional but recommended)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIdUpload(e.target.files[0])}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
                />
                {uploading && <p className="text-xs text-gray-400 mt-1">Uploading photo...</p>}
                {idPhoto && <p className="text-xs text-green-500 mt-1">✓ Photo uploaded successfully</p>}
              </div>
            </div>

            <button
              onClick={handleIdVerification}
              disabled={loading || !college || !idNumber}
              className="w-full bg-[#2B4593] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40 mt-6"
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Verification