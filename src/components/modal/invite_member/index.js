import { Form, TextField, SubmitButton, PermissionsSelector } from '../../form'

import { useCallback } from 'react'
import { useMutation } from '@apollo/client'

import { CreateProjectInvite } from 'graphql/mutations'
import { GetProject } from 'graphql/queries'
import { useModal } from 'context/modal'
import { useStateContext } from 'context/state'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

const InviteMemberModal = () => {
  const { selectedProject } = useStateContext()
  const [doInviteMember, { loading, error }] = useMutation(CreateProjectInvite)
  const { closeModal } = useModal()

  const inviteMember = useCallback(
    async (member) => {
      await doInviteMember({
        variables: {
          projectId: selectedProject.id,
          ...member
        },
        refetchQueries: [GetProject]
      })

      toast.success('Successfully sent invite')

      mixpanel.track('Create project invite', {
        projectId: selectedProject.id,
        ...member
      })

      closeModal()
    },
    [doInviteMember, closeModal, selectedProject]
  )

  const formErrors =
    error && error.graphQLErrors ? error.graphQLErrors[0].errors : null

  return (
    <>
      <h1>Invite Member</h1>

      <Form
        initialState={{ email: '', permissions: [] }}
        onSubmit={inviteMember}
        errors={formErrors}
        loading={loading}
      >
        <TextField
          label="E-mail"
          field="email"
          placeholder="User@company.com"
        />

        <PermissionsSelector field="permissions" />
        <SubmitButton label="Send Invite" />
      </Form>
    </>
  )
}

export default InviteMemberModal
