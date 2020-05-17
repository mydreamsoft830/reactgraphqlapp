import { useEffect } from 'react'
import Button from 'components/button'
import { useLocalStateContext } from 'context/local_state'
import { ImCheckboxChecked } from 'react-icons/im'

import { useModal } from 'context/modal'
import LegacyCredentialsFields from 'components/credential_field'

const Step2 = () => {
  const {
    state: { device }
  } = useLocalStateContext()
  const { hideCloseButton, closeModal } = useModal()

  useEffect(() => {
    hideCloseButton()
  })

  if (!device) return null

  return (
    <>
      <div className="success-header">
        <ImCheckboxChecked />
        <h2>Success</h2>
      </div>

      <div className="success-lower">
        <p>
          Your device is now ready to connect to the IoT Core with the below
          credentials.
        </p>

        <LegacyCredentialsFields
          device={device}
          plaintextCredential={device.credentials[0]}
        />

        <div className="success-footer">
          <Button onClick={closeModal}>Finish</Button>
        </div>
      </div>
    </>
  )
}

export default Step2
