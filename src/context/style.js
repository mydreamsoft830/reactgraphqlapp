import { createContext, useState, useContext, useEffect } from 'react'

export const StyleContext = createContext({})

export const StyleContextProvider = (props) => {
  const { children } = props
  const [contentStyles, setContentStyles] = useState([])

  return (
    <StyleContext.Provider value={{ contentStyles, setContentStyles }}>
      {children}
    </StyleContext.Provider>
  )
}

export const useStyle = () => {
  return useContext(StyleContext)
}

export const useFullWidthContentStyle = () => {
  const { setContentStyles } = useContext(StyleContext)

  useEffect(() => {
    setContentStyles((styles) => {
      return ['fullWidth'].concat(styles)
    })

    return () => {
      setContentStyles((styles) => {
        return styles.filter((style) => style !== 'fullWidth')
      })
    }
  }, [setContentStyles])
}
