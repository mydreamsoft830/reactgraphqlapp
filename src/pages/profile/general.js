import { useAuth0 } from '@auth0/auth0-react'
import { Form, FormFrame, TextField, SubmitButton } from 'components/form'

const General = () => {
  const { user } = useAuth0()

  return (
    <Form initialState={user} onSubmit={() => {}} errors={null} loading={false}>
      <FormFrame title="User Profile">
        <TextField label="Name" field="name" disabled={true} />
        <TextField label="E-mail" field="email" disabled={true} />

        <SubmitButton disabled={true} />
      </FormFrame>
    </Form>
  )
}

export default General
