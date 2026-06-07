import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiLocationMarker, HiAcademicCap } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'

function UserProfile() {
  const [connected, setConnected] = useState(false)
  const [pending, setPending] = useState(false)

  const handleConnect = () => {
    if (!connected && !pending) {
      setPending(true)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Profile</h1>
      </div>

      <div className="pt-16">

        {/* Profile Header */}
        <div className="px-4 py-6 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-[#8EB3E7] flex items-center justify-center text-white text-3xl font-bold">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">Sara Khan</h2>
                <span className="text-xs bg-[#2B4593] text-white px-2 py-0.5 rounded-full">✓ Verified</span>
              </div>
              <p className="text-sm text-gray-500">@sara</p>
              <p className="text-sm text-gray-500 mt-1">CSE Student | Developer</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <HiAcademicCap size={16} />
            <span>ABC College of Engineering</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <HiLocationMarker size={16} />
            <span>Kerala, India</span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <p className="font-bold text-gray-800">312</p>
              <p className="text-xs text-gray-400">Connections</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800">18</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                connected
                  ? 'bg-gray-100 text-gray-500'
                  : pending
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-[#2B4593] text-white'
              }`}
            >
              {connected ? 'Connected' : pending ? 'Pending' : 'Connect'}
            </button>
            <Link to="/chat/1" className="flex-1">
              <button className="w-full border border-[#2B4593] text-[#2B4593] py-2 rounded-xl text-sm font-semibold">
                Message
              </button>
            </Link>
          </div>
        </div>

        {/* Experience */}
        <div className="px-4 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Experience</h3>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8EB3E7] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              G
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Frontend Developer Intern</p>
              <p className="text-xs text-gray-500">Google · Summer 2025</p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="px-4 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Education</h3>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">ABC College of Engineering</p>
              <p className="text-xs text-gray-500">B.E. Computer Science · 2024 - 2028</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="px-4 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'Python', 'UI/UX', 'JavaScript'].map((skill) => (
              <span key={skill} className="bg-[#8EB3E7]/20 text-[#2B4593] text-xs px-3 py-1 rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="px-4 py-4">
          <h3 className="font-bold text-gray-800 mb-3">Posts</h3>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-700">Just got my internship offer! Hard work pays off 💪</p>
            <p className="text-xs text-gray-400 mt-2">5 days ago</p>
            <div className="flex gap-4 text-gray-400 text-sm border-t mt-3 pt-3">
              <button className="hover:text-[#2B4593]">👍 Like</button>
              <button className="hover:text-[#2B4593]">🤝 Support</button>
              <button className="hover:text-[#2B4593]">💬 Comment</button>
              <button className="hover:text-[#2B4593]">↗ Share</button>
            </div>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}

export default UserProfile