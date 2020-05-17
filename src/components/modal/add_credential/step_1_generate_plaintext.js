import { useMultistep } from 'components/multistep'
import { useCallback } from 'react'
import { TextField, SubmitButton, SelectField } from 'components/form'
import { OutlineButton } from 'components/button'

const Step1GeneratePlaintext = () => {
  const { setCurrentStep } = useMultistep()

  const goBack = useCallback(() => setCurrentStep(0), [setCurrentStep])
  const nextStep = useCallback(() => setCurrentStep(2), [setCurrentStep])

  return (
    <div className="add-keypair-container">
      <h1>Add New Credential</h1>

      <TextField
        label="Display Name"
        field="displayName"
        required={true}
        description={
          'A Display Name is used to help you uniquely identify these credentials'
        }
      />

      <SelectField
        label="Credentials Length"
        field="length"
        required={true}
        description={
          'The maximum username and password length supported by your device'
        }
        options={[
          { value: 16, label: '16 characters' },
          { value: 24, label: '24 characters' },
          { value: 32, label: '32 characters (reccommended)' }
        ]}
      />

      <div className="button-footer">
        <OutlineButton onClick={goBack}>Back</OutlineButton>
        <SubmitButton label={'Create Basic Credentials'} onSuccess={nextStep} />
      </div>
    </div>
  )
}

export default Step1GeneratePlaintext
