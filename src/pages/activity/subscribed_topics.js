import { useActivityContext } from '../../context/activity_context'
import { DateWithSeconds } from 'components/date'
import { AiOutlineClose } from 'react-icons/ai'
import CodeEditor from '@uiw/react-textarea-code-editor'

const SubscribedTopic = ({ topic, selectedTopic, onClick = () => {} }) => {
  const { removeTopicSubscription } = useActivityContext()
  const className =
    selectedTopic && topic.topic === selectedTopic.topic ? 'selected' : ''

  return (
    <div className={className} onClick={onClick}>
      <div>
        <span>Topic</span>
        <span>{topic.topic}</span>
      </div>
      <span
        className="close-icon"
        onClick={() => removeTopicSubscription(topic.topic)}
      >
        <AiOutlineClose />
      </span>
    </div>
  )
}

const SubscribedTopicMessages = ({ message }) => {
  const className = ''

  return (
    <div className={className}>
      <span className="message-time">
        <DateWithSeconds time={message.time} />
      </span>
      <div>
        <span>Topic</span>
        <span>
          <CodeEditor
            value={message.topic}
            language="json"
            onChange={() => {}}
            padding={15}
            style={{
              fontSize: 12,
              width: '100%',
              fontFamily:
                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
            }}
            readOnly={true}
          />
        </span>
      </div>
      <div>
        <span>Payload</span>
        <span>
          <CodeEditor
            value={atob(message.payload)}
            language="json"
            onChange={() => {}}
            padding={15}
            style={{
              fontSize: 12,
              width: '100%',
              fontFamily:
                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
            }}
            readOnly={true}
          />
          {}
        </span>
      </div>
    </div>
  )
}

const SubscribedTopics = () => {
  const {
    subscribedTopics,
    receivedMessages,
    selectedTopic,
    setSelectedTopic
  } = useActivityContext()

  return (
    <div className="subscribed-topics">
      <div className="topic-select">
        <div className="col-header">Subscribed Topics</div>

        {subscribedTopics.map((topic, i) => (
          <SubscribedTopic
            topic={topic}
            selectedTopic={selectedTopic}
            onClick={() => setSelectedTopic(topic)}
            key={i}
          />
        ))}
      </div>

      <div className="messages">
        <div className="col-header">Messages</div>
        {receivedMessages.map((message, i) => (
          <SubscribedTopicMessages key={i} message={message} />
        ))}
      </div>
    </div>
  )
}

export default SubscribedTopics
