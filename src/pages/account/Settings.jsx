import { Link, useNavigate } from 'react-router-dom'
import {
  HiUser, HiLockClosed, HiShieldCheck, HiBan,
  HiLogout, HiChevronRight, HiMoon, HiBadgeCheck
} from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

function Settings() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sections = [
    {
      title: 'Profile',
      items: [
        { to: '/settings/edit-profile', icon: <HiUser size={20} className="text-[#2B4593]" />, label: 'Edit Profile', desc: 'Update your info and photo' },
        { to: '/settings/verification', icon: <HiBadgeCheck size={20} className="text-[#2B4593]" />, label: 'Student Verification', desc: 'Get verified on EP' },
      ]
    },
    {
      title: 'Account',
      items: [
        { to: '/settings/account', icon: <HiShieldCheck size={20} className="text-[#2B4593]" />, label: 'Account Settings', desc: 'Email, password, delete account' },
        { to: '/settings/privacy', icon: <HiLockClosed size={20} className="text-[#2B4593]" />, label: 'Privacy Settings', desc: 'Control who sees your content' },
        { to: '/settings/blocked', icon: <HiBan size={20} className="text-[#2B4593]" />, label: 'Blocked Users', desc: 'Manage blocked accounts' },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with user info */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#2B4593] flex items-center justify-center text-white text-2xl font-bold">
              {user?.fullName?.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-gray-800">{user?.fullName}</p>
            <p className="text-sm text-gray-400">@{user?.username}</p>
            <Link to="/profile" className="text-xs text-[#2B4593] font-semibold mt-1 block">
              View Profile →
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              {section.items.map((item, index) => (
                <Link to={item.to} key={item.to}>
                  <div className={`flex items-center justify-between px-4 py-4 ${index < section.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <HiChevronRight size={18} className="text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Dark Mode placeholder */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Appearance</p>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-4 py-4 opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <HiMoon size={20} className="text-[#2B4593]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Dark Mode</p>
                  <p className="text-xs text-gray-400 mt-0.5">Coming soon</p>
                </div>
              </div>
              <span className="text-xs text-gray-300 bg-gray-100 px-2 py-1 rounded-full">Soon</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 w-full">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <HiLogout size={20} className="text-red-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-red-500">Log Out</p>
              <p className="text-xs text-gray-400 mt-0.5">Sign out of your account</p>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">EP · Version 1.0</p>
      </div>
    </div>
  )
}

export default Settings