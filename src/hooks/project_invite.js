import { useCallback } from 'react'
import { CompleteUserProjectInvite } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import { useModal } from 'context/modal'
import { User, ProjectsForUser } from 'graphql/queries'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

import ConfirmationModal from 'components/modal/confirmation'

export const useAcceptInvite = (invite) => {
  const [completeInvite, { loading, error }] = useMutation(
    CompleteUserProjectInvite
  )
  const { openModal } = useModal()

  const acceptInvite = useCallback(async () => {
    const doCompleteInvite = async () => {
      await completeInvite({
        variables: {
          projectId: invite.projectId,
          accept: true
        },
        refetchQueries: [User, ProjectsForUser]
      })

      toast.success('Successfully accepted invite')

      mixpanel.track('Accepted invite', {
        projectId: invite.projectId,
        accept: true
      })
    }

    await openModal(
      <ConfirmationModal
        title="Accept invitation"
        message={`Are you sure you want to accept this invitation to join "${invite.projectName}"?`}
        danger={true}
        onAccept={doCompleteInvite}
      />
    )
  }, [completeInvite, invite, openModal])

  const declineInvite = useCallback(async () => {
    const doCompleteInvite = async () => {
      await completeInvite({
        variables: {
          projectId: invite.projectId,
          accept: false
        },
        refetchQueries: [User, ProjectsForUser]
      })

      toast.success('Successfully declined invite')

      mixpanel.track('Declined invite', {
        projectId: invite.projectId,
        accept: true
      })
    }

    await openModal(
      <ConfirmationModal
        title="Decline invitation"
        message={`Are you sure you want to decline this invitation to join "${invite.projectName}"?`}
        danger={true}
        onAccept={doCompleteInvite}
      />
    )
  }, [completeInvite, invite, openModal])

  return [acceptInvite, declineInvite, { loading, error }]
}
