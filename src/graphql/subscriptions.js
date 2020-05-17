import { gql } from '@apollo/client'

export const MQTTSubscription = gql`
  subscription MQTTSubscription($projectId: UUID!, $topics: [String]) {
    mqttSubscription(projectId: $projectId, topics: $topics) {
      topic
      payload
      time
    }
  }
`
