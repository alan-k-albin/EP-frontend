import { Link, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiUser, HiLockClosed, HiShieldCheck, HiBan, HiLogout, HiChevronRight } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

function Settings() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center gap-3">
        <Link to="/profile">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Settings</h1>
      </div>

      <div className="pt-16">
        <div className="px-4 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>

          {[
            { to: '/settings/edit-profile', icon: <HiUser size={20} className="text-[#2B4593]" />, label: 'Edit Profile' },
            { to: '/settings/account', icon: <HiShieldCheck size={20} className="text-[#2B4593]" />, label: 'Account Settings' },
            { to: '/settings/privacy', icon: <HiLockClosed size={20} className="text-[#2B4593]" />, label: 'Privacy Settings' },
            { to: '/settings/blocked', icon: <HiBan size={20} className="text-[#2B4593]" />, label: 'Blocked Users' },
            { to: '/settings/verification', icon: <HiShieldCheck size={20} className="text-[#2B4593]" />, label: 'Student Verification' },
          ].map((item) => (
            <Link to={item.to} key={item.to}>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <p className="text-sm text-gray-800">{item.label}</p>
                </div>
                <HiChevronRight size={18} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        <div className="px-4 py-3 mt-4">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 py-4 w-full">
            <HiLogout size={20} />
            <p className="text-sm font-semibold">Log Out</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings