import { useCallback } from 'react'
import { DeleteRule } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import { GetRules } from 'graphql/queries'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import ConfirmationModal from 'components/modal/confirmation'

export const useRemoveRule = ({ id, displayName }) => {
  const [doDeleteRule] = useMutation(DeleteRule)
  const { selectedProject } = useStateContext()
  const { openModal } = useModal()
  const navigate = useNavigate()

  return useCallback(async () => {
    const deleteRule = async () => {
      await doDeleteRule({
        variables: {
          projectId: selectedProject.id,
          ruleId: id
        },
        refetchQueries: [GetRules] // TODO: Refresh project cache
      })

      toast.success('Successfully removed rule')

      navigate('/rules')
    }

    await openModal(
      <ConfirmationModal
        title="Remove Rule"
        message={`Are you sure you want to remove rule "${displayName}"?`}
        danger={true}
        onAccept={deleteRule}
      />
    )
  }, [doDeleteRule, id, displayName, openModal, selectedProject, navigate])
}
