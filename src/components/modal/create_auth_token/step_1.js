import { OutlineButton } from 'components/button'
import LegacyCredentialsFields from 'components/credential_field'
import { useMultistep } from 'components/multistep'
import { useModal } from 'context/modal'

const Step1 = ({ device, keypair }) => {
  const { closeModal } = useModal()
  const { currentStep } = useMultistep()

  if (currentStep !== 1) return null

  return (
    <div className="auth-step-container">
      <h1>Create Auth Token</h1>

      <LegacyCredentialsFields device={device} keypair={device.keypairs[0]} />

      <div className="button-footer">
        <OutlineButton onClick={closeModal}>Close</OutlineButton>
      </div>
    </div>
  )
}

export default Step1
