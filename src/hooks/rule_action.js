import { useCallback } from 'react'
import { DeleteRuleAction } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import { GetRule } from 'graphql/queries'
import { toast } from 'react-toastify'

import ConfirmationModal from 'components/modal/confirmation'

export const useRemoveRuleAction = (rule, { id, displayName }) => {
  const [doDeleteRuleAction] = useMutation(DeleteRuleAction)
  const { selectedProject } = useStateContext()
  const { openModal } = useModal()

  return useCallback(async () => {
    const deleteRuleAction = async () => {
      await doDeleteRuleAction({
        variables: {
          projectId: selectedProject.id,
          ruleId: rule.id,
          ruleActionId: id
        },
        refetchQueries: [GetRule] // TODO: Refresh project cache
      })

      toast.success('Successfully removed rule action')
    }

    await openModal(
      <ConfirmationModal
        title="Remove Rule Action"
        message={`Are you sure you want to remove rule action "${displayName}"?`}
        danger={true}
        onAccept={deleteRuleAction}
      />
    )
  }, [doDeleteRuleAction, rule, id, displayName, openModal, selectedProject])
}
