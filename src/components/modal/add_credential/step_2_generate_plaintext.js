import { useEffect } from 'react'
import { ImCheckboxChecked } from 'react-icons/im'
import Button from 'components/button'
import { useModal } from 'context/modal'
import LegacyCredentialsFields from 'components/credential_field'
import { useLocalStateContext } from 'context/local_state'

const Step2GenerateLegacy = ({ device }) => {
  const { hideCloseButton, closeModal } = useModal()
  const {
    state: { plaintextResponse }
  } = useLocalStateContext()

  useEffect(() => {
    hideCloseButton()
  }, [hideCloseButton])

  if (!plaintextResponse) return null

  return (
    <>
      <div className="success-header">
        <ImCheckboxChecked />
        <h2>Success</h2>
      </div>

      <div className="success-lower keypair-generate-success">
        <p>Your newly generated credentials are ready to go.</p>

        <LegacyCredentialsFields plaintextCredential={plaintextResponse} />

        <div className="success-footer">
          <Button onClick={closeModal}>Finish</Button>
        </div>
      </div>
    </>
  )
}

export default Step2GenerateLegacy
