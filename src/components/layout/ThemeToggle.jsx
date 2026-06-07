import { useTheme } from '../../context/ThemeContext'
import { HiSun, HiMoon } from 'react-icons/hi'

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 text-gray-500 hover:text-[#2B4593]"
    >
      {darkMode ? <HiSun size={22} /> : <HiMoon size={22} />}
    </button>
  )
}

export default ThemeToggle