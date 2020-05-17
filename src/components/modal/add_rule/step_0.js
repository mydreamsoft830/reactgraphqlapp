import { TextField, SubmitButton, Radio } from 'components/form'
import { useModal } from 'context/modal'

const PayloadOptions = [
  { name: 'JSON', value: 'json' },
  { name: 'Sparkplug', value: 'sparkplug' }
]

const Step0 = () => {
  const { closeModal } = useModal()

  return (
    <div className="add-rule-container">
      <h1>Add New Rule</h1>

      <div className="step-container">
        <TextField
          label="Display Name"
          field="displayName"
          placeholder="My New Rule"
        />

        <Radio
          label="Message Format"
          field="payloadType"
          options={PayloadOptions}
        />

        <div className="button-footer">
          <SubmitButton label={'Add Rule'} onSuccess={closeModal} />
        </div>
      </div>
    </div>
  )
}

export default Step0
