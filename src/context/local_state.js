import React, { createContext, useCallback, useContext, useState } from 'react'

export const LocalStateContext = createContext({})

export const LocalStateContextProvider = (props) => {
  const { children, initialState = {} } = props
  const [state, setState] = useState(initialState)

  const setLocalValue = useCallback(
    (key, value) => {
      setState((currentState) => {
        return { ...currentState, [key]: value }
      })
    },
    [setState]
  )

  return (
    <LocalStateContext.Provider
      value={{
        setLocalValue,
        state
      }}
    >
      {children}
    </LocalStateContext.Provider>
  )
}

export const useLocalStateContext = () => useContext(LocalStateContext)

export const withLocalStateContext = (component, initialState = {}) => {
  return (props) => (
    <LocalStateContextProvider initialState={initialState}>
      {React.createElement(component, props)}
    </LocalStateContextProvider>
  )
}
