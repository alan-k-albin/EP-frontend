import { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved === 'true') setDarkMode(true)
  }, [])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', !darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

export default ThemeContext