import { Form, SubmitButton, PermissionsSelector } from '../../form'

import { useCallback } from 'react'
import { useMutation } from '@apollo/client'

import { ModifyProjectMemberPermissions } from 'graphql/mutations'
import { GetProject } from 'graphql/queries'
import { useModal } from 'context/modal'
import { useStateContext } from 'context/state'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

const AssignPermissionsModal = ({ user, permissions }) => {
  const { selectedProject } = useStateContext()
  const [doModifyPermissions, { loading, error }] = useMutation(
    ModifyProjectMemberPermissions
  )
  const { closeModal } = useModal()

  const applyPermissions = useCallback(
    async ({ permissions }) => {
      const result = await doModifyPermissions({
        variables: {
          projectId: selectedProject.id,
          memberId: user.id,
          permissions
        },
        refetchQueries: [GetProject]
      })

      if (result) {
        toast.success('Successfully modified permissions')
        closeModal()
      } else {
        toast.error(`Error updating member`)
      }

      mixpanel.track('Assigned permissions', {
        projectId: selectedProject.id,
        memberId: user.id,
        permissions
      })
    },
    [user, doModifyPermissions, selectedProject, closeModal]
  )

  return (
    <>
      <h1>Assign Permissions</h1>

      <Form
        initialState={{ permissions }}
        onSubmit={applyPermissions}
        errors={error}
        loading={loading}
      >
        <PermissionsSelector field="permissions" />
        <SubmitButton label="Apply permissions" />
      </Form>
    </>
  )
}

export default AssignPermissionsModal
