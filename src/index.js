import React from 'react'
import ReactDOM from 'react-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import AuthorizedApolloProvider from 'components/apollo'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import mixpanel from 'mixpanel-browser'

import App from './App'
import './index.css'

mixpanel.init('afc08971eb519cd5d83c8be3ff9d5c88')

const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
  const navigate = useNavigate()

  const onRedirectCallback = (appState) => {
    if (appState && appState.returnTo) {
      const url = appState.returnTo === '/logout' ? '/' : appState.returnTo
      navigate(url)
    } else {
      navigate('/')
    }
  }

  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        audience={process.env.REACT_APP_AUDIENCE_URL}
        scope="openid profile email read:devices"
        redirectUri={window.location.origin}
        useRefreshTokens={true}
        cacheLocation="memory"
      >
        <AuthorizedApolloProvider>
          <App />
        </AuthorizedApolloProvider>
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
