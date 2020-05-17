import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback
} from 'react'
import { useStateContext } from 'context/state'
import { MQTTSubscription } from 'graphql/subscriptions'
import { useSubscription } from '@apollo/client'
import { matchesSubscription } from '../rules/mqtt'

export const ActivityContext = createContext({})

const MAX_MESSAGES = 100

export const ActivityContextProvider = (props) => {
  const { children } = props
  const { selectedProject } = useStateContext()
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [subscribedTopics, setSubscribedTopics] = useState([])
  const [receivedMessages, setReceivedMessages] = useState([])

  const { error } = useSubscription(MQTTSubscription, {
    variables: {
      projectId: selectedProject.id,
      topics: subscribedTopics.map((t) => t.topic)
    },
    onSubscriptionData: ({
      subscriptionData: {
        data: { mqttSubscription }
      }
    }) => {
      setReceivedMessages((messages) => {
        const newMessage = mqttSubscription
        const allMessages = [newMessage].concat(messages)

        return allMessages.slice(0, MAX_MESSAGES)
      })
    }
  })

  const filteredMessages = useMemo(() => {
    if (selectedTopic == null) return []

    return receivedMessages.filter((message) => {
      return matchesSubscription(message.topic, selectedTopic.topic)
    })
  }, [selectedTopic, receivedMessages])

  const addNewTopicSubscription = useCallback(
    ({ topicFilter }) => {
      if (topicFilter.length === 0) return

      const newTopic = { topic: topicFilter }

      setSubscribedTopics((topics) => {
        const existingTopic = topics.find((t) => t.topic === topicFilter)

        return existingTopic ? topics : topics.concat([newTopic])
      })
    },
    [setSubscribedTopics]
  )

  const removeTopicSubscription = useCallback(
    (topicName) => {
      setSubscribedTopics((topics) => {
        return topics.filter((t) => t.topic !== topicName)
      })

      if (selectedTopic.topic === topicName) {
        setSelectedTopic(null)
      }
    },
    [setSubscribedTopics, selectedTopic, setSelectedTopic]
  )

  useEffect(() => {
    if (selectedTopic == null && subscribedTopics.length > 0) {
      setSelectedTopic(subscribedTopics[0])
    }
  }, [selectedTopic, subscribedTopics])

  return (
    <ActivityContext.Provider
      value={{
        error,
        subscribedTopics,
        addNewTopicSubscription,
        removeTopicSubscription,
        receivedMessages: filteredMessages,
        selectedTopic,
        setSelectedTopic
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivityContext = () => useContext(ActivityContext)
