import { useState } from 'react'
import { BiCopy } from 'react-icons/bi'
import { useCallback } from 'react'

import './credential_field.scss'

export const CredentialField = ({ value }) => {
  const [alertOpen, setAlertOpen] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(value)
    setAlertOpen(true)

    setTimeout(() => setAlertOpen(false), 1000)
  }, [value])

  const alertClass = ['copied-alert']
  if (alertOpen) alertClass.push('open')

  return (
    <div className="credential-field">
      <code>{value}</code>
      <div className="copy-button" onClick={copyToClipboard}>
        <BiCopy />
        <div className={alertClass.join(' ')}>
          <div>Copied!</div>
        </div>
      </div>
    </div>
  )
}

const LegacyCredentialsFields = ({ plaintextCredential }) => (
  <div className="device-credentials">
    <span>
      <span>MQTT Server</span>
      <CredentialField value={process.env.REACT_APP_MQTT_URL} />
    </span>
    <span>
      <span>Username</span>
      <CredentialField value={plaintextCredential.username} />
    </span>
    <span>
      <span>Password</span>
      <CredentialField value={plaintextCredential.password} />
    </span>
  </div>
)

export default LegacyCredentialsFields
