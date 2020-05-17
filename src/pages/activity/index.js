import { Tabs, Tab } from 'components/tabs'
import { Routes, Route } from 'react-router-dom'
import { Form, TextField, SubmitButton, CodeArea, Radio } from 'components/form'
import SubscribedTopics from './subscribed_topics'
import { useActivityContext } from '../../context/activity_context'
import { useMutation } from '@apollo/client'
import { MqttPublish } from 'graphql/mutations'
import { useStateContext } from 'context/state'
import Error from 'components/error'

import './activity.scss'
import { useCallback } from 'react'
import useLocalStorage from 'hooks/use_local_storage'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

const PayloadOptions = [
  { name: 'Ascii', value: 'ascii' },
  { name: 'Base64', value: 'base64' }
]

const SubscribeAction = () => {
  const { addNewTopicSubscription } = useActivityContext()
  const { selectedProject } = useStateContext()

  const subscribeToTopic = useCallback(
    (formData) => {
      mixpanel.track('Subscribed to topic', {
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        topic: formData.topicFilter
      })

      addNewTopicSubscription(formData)
    },
    [addNewTopicSubscription, selectedProject]
  )

  return (
    <div className="activity-action">
      <Form initialState={{}} onSubmit={subscribeToTopic}>
        <div>
          <TextField
            field="topicFilter"
            label="Topic"
            placeholder="Enter a topic to subscribe to"
            description="Enter a topic filter to subscribe to one or more topics and receive
            messages in realtime. The topic filter can include MQTT wildcard
            characters."
            required={true}
          />
        </div>

        <div>
          <SubmitButton label="Subscribe" />
        </div>
      </Form>
    </div>
  )
}

const PublishAction = () => {
  const [doMqttPublish] = useMutation(MqttPublish)
  const { selectedProject } = useStateContext()
  const [topic, setTopic] = useLocalStorage('activity.topic', '')
  const [payload, setPayload] = useLocalStorage('activity.payload', '')
  const [payloadType, setPayloadType] = useLocalStorage(
    'activity.payloadType',
    'ascii'
  )

  const submitPublish = useCallback(
    async (formData) => {
      const payload =
        formData.payloadType === 'ascii'
          ? btoa(formData.payload)
          : formData.payload

      mixpanel.track('Published Data', {
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        payloadType: formData.payloadType,
        payloadSize: formData.payload.length,
        topic: formData.topic
      })

      try {
        await doMqttPublish({
          variables: {
            ...formData,
            payload,
            projectId: selectedProject.id
          }
        })

        toast.success('Successfully published message')
      } catch (e) {
        toast.error(`Error publishing message. ${e.message}`)
      }
    },
    [doMqttPublish, selectedProject]
  )

  const formValueChangeHandler = useCallback(
    (formValues) => {
      setTopic(formValues.topic)
      setPayload(formValues.payload)
      setPayloadType(formValues.payloadType)
    },
    [setTopic, setPayload, setPayloadType]
  )

  return (
    <div className="activity-action">
      <Form
        initialState={{ topic, payload, payloadType }}
        onSubmit={submitPublish}
        onChange={formValueChangeHandler}
      >
        <div>
          <TextField
            field="topic"
            label="Topic"
            placeholder="Enter a topic to publish to"
            required={true}
          />
        </div>
        <div>
          <CodeArea
            field="payload"
            label="Payload"
            placeholder="Enter a payload to publish"
            required={true}
          />
        </div>

        <Radio field="payloadType" options={PayloadOptions} />

        <div>
          <SubmitButton label="Publish" />
        </div>
      </Form>
    </div>
  )
}

const Activity = ({ formAction }) => {
  const { error } = useActivityContext()

  if (error) {
    return <Error error={error} />
  }

  return (
    <div className="activity">
      <h1>Activity</h1>

      <Tabs>
        <Tab name="Subscribe to a topic" path="/activity" index />
        <Tab name="Publish to a topic" path="/activity/publish" />
      </Tabs>

      {formAction === 'subscribe' ? <SubscribeAction /> : <PublishAction />}

      <SubscribedTopics />
    </div>
  )
}

const ActivityRouter = () => {
  return (
    <Routes>
      <Route index element={<Activity formAction="subscribe" />} />
      <Route path="publish" element={<Activity formAction="publish" />} />
    </Routes>
  )
}

export default ActivityRouter
