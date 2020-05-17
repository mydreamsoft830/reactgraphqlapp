import { RiErrorWarningLine } from 'react-icons/ri'

import './error.scss'

const Error = ({ error }) => {
  return (
    <div className="error-page-container">
      <div>
        <div className="error-page__icon">
          <RiErrorWarningLine />
        </div>
        <div>
          <h1>Error</h1>
          <span>{error.message}</span>
        </div>
      </div>
    </div>
  )
}

export default Error
