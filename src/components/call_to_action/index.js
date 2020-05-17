import { Link } from 'react-router-dom'
import { HiArrowNarrowRight } from 'react-icons/hi'

import './call_to_action.scss'

const CallToAction = ({ children }) => {
  return <div className="call-to-action">{children}</div>
}

export const CallToActionHeader = ({ children }) => {
  return <h1>{children}</h1>
}

export const CallToActionDescription = ({ children }) => {
  return <div className="cta-description">{children}</div>
}

export const CallToActionImage = ({ children }) => {
  return <div className="cta-image">{children}</div>
}

export const CallToActionVerticalBox = ({
  icon,
  linkText,
  linkUrl,
  children
}) => {
  return (
    <div className="call-to-action-vertical">
      <span className="icon">{icon}</span>
      <div>{children}</div>
      <span className="link">
        <Link to={linkUrl}>
          {linkText} <HiArrowNarrowRight />
        </Link>
      </span>
    </div>
  )
}

export default CallToAction
