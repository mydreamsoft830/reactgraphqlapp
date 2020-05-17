

import { TextField, SubmitButton } from 'components/form'
import { useModal } from 'context/modal'

const Step = () => {

  const { closeModal } = useModal()

  return (
    <div className="add-dashboard-container">
      <h1>Add New Dashboard</h1>

      <div className="step-container">
        <TextField
          label="Display Name"
          field="displayName"
          placeholder="New Dashboard Name"
        />

        <div className="button-footer">
          <SubmitButton label={'Add Dashboard'} onSuccess={closeModal} />
        </div>
      </div>
    </div>
  )
}

export default Step
