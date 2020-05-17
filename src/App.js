import { useAuth0 } from '@auth0/auth0-react'

import { Template } from './components/template'
import { StateContextProvider } from './context/state'
import { ModalContextProvider } from './context/modal'
import Routes from './routes'
import { LoadingFullFrame } from './components/loading'
import { StyleContextProvider } from 'context/style'
import { ToastContainer } from 'react-toastify'
import { ThemeContextProvider } from './context/theme_context'
import Error from 'components/error'
import { ActivityContextProvider } from 'context/activity_context'
import 'react-toastify/dist/ReactToastify.css'
import mixpanel from 'mixpanel-browser'

const App = () => {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect
  } = useAuth0()

  if (error) return <Error error={error} />
  if (isLoading) return <LoadingFullFrame />

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    })
    return <LoadingFullFrame />
  } else {
    mixpanel.identify(user.sub)
    mixpanel.alias(user.email)
    mixpanel.people.set({
      $name: user.name,
      $email: user.email,
      nickname: user.nickname,
      email_verified: user.email_verified
    })
  }

  return (
    <>
      <ToastContainer position={'bottom-right'} />
      <ThemeContextProvider>
        <StyleContextProvider>
          <StateContextProvider>
            <ModalContextProvider>
              <Template>
                <ActivityContextProvider>
                  <Routes />
                </ActivityContextProvider>
              </Template>
            </ModalContextProvider>
          </StateContextProvider>
        </StyleContextProvider>
      </ThemeContextProvider>
    </>
  )
}

export default App
