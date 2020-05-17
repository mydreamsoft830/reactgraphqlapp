import { OutlineButton } from 'components/button'
import { TextField, SubmitButton } from 'components/form'
import { useMultistep } from 'components/multistep'
import { useCallback } from 'react'

const Step1 = () => {
  const { setCurrentStep } = useMultistep()

  const goBack = useCallback(() => setCurrentStep(0), [setCurrentStep])
  const nextStep = useCallback(() => setCurrentStep(2), [setCurrentStep])

  return (
    <div className="add-device-container">
      <h1>Add New Device</h1>

      <div className="step-container">
        <TextField
          label="Display Name"
          field="displayName"
          placeholder="My New Legacy Device"
        />

        <div className="button-footer">
          <OutlineButton onClick={goBack}>Back</OutlineButton>
          <SubmitButton label={'Add Device'} onSuccess={nextStep} />
        </div>
      </div>
    </div>
  )
}

export default Step1
