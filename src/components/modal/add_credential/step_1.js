import { useMultistep } from 'components/multistep'
import { useCallback } from 'react'
import { useLocalStateContext } from 'context/local_state'
import { TextField, SubmitButton, FileField } from 'components/form'
import { OutlineButton } from 'components/button'

const Step1 = () => {
  const { setCurrentStep } = useMultistep()
  const {
    state: { mode }
  } = useLocalStateContext()

  const goBack = useCallback(() => setCurrentStep(0), [setCurrentStep])
  const nextStep = useCallback(() => setCurrentStep(2), [setCurrentStep])

  return (
    <div className="add-keypair-container">
      <h1>Add New Keypair</h1>

      <TextField
        label="Display Name"
        field="displayName"
        required={true}
        description={
          'A Display Name is used to help you uniquely identify this keypair'
        }
      />

      {mode === 'uploadNew' && (
        <FileField
          label="Public Key"
          field="publicKey"
          required={true}
          description={'This must be a PEM encoded RSA public key'}
        />
      )}

      <div className="button-footer">
        <OutlineButton onClick={goBack}>Back</OutlineButton>
        <SubmitButton label={'Create Keypair'} onSuccess={nextStep} />
      </div>
    </div>
  )
}

export default Step1
