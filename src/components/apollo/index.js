import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  split,
  InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/link-context'
import { useAuth0 } from '@auth0/auth0-react'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { RetryLink } from '@apollo/client/link/retry'

const AUTH0_SCOPES = [
  'read:project',
  'read:device',
  'write:project',
  'write:device',
  'write:rule',
  'read:rule',
  'read:timeseries',
  'write:timeseries',
  'read:activity',
  'write:activity'
]

const AuthorizedApolloProvider = ({ children }) => {
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0()

  const getToken = async () => {
    try {
      return await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUDIENCE_URL,
        scope: AUTH0_SCOPES.join(' ')
      })
    } catch (e) {
      return await getAccessTokenWithPopup({
        audience: process.env.REACT_APP_AUDIENCE_URL,
        scope: AUTH0_SCOPES.join(' ')
      })
    }
  }

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_API_URL
  })

  const wsLink = new GraphQLWsLink(
    createClient({
      url: process.env.REACT_APP_SUBSCRIPTION_API_URL,
      connectionParams: async () => {
        const token = await getToken()

        return {
          Authorization: `Bearer ${token}`
        }
      }
    })
  )

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  const authLink = setContext(async () => {
    const token = await getToken()

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })

  const retryLink = new RetryLink({
    delay: {
      initial: 500,
      max: 10000,
      jitter: true
    },
    attempts: {
      max: Infinity,
      retryIf: (error, _operation) => !!error
    }
  })

  const apolloClient = new ApolloClient({
    link: retryLink.concat(authLink.concat(splitLink)),
    cache: new InMemoryCache(),
    connectToDevTools: true
  })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

export default AuthorizedApolloProvider
