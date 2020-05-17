import { createContext, useContext, useState } from 'react'

export const ThemeContext = createContext({
  theme: '',
  setTheme: theme => {}
})

export const ThemeContextProvider = props => {
  const { children } = props
  const isBrowserDefaultDark = () =>
    window.matchMedia('(prefers-color-scheme:dark)').matches

  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem('default-theme')
    const browserDefault = isBrowserDefaultDark() ? 'dark' : 'light'
    return localStorageTheme || browserDefault
  }
  const [theme, setTheme] = useState(getDefaultTheme())
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <span className={`style-${theme}`}>{children}</span>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)
