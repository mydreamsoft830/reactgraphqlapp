import { useCallback } from 'react'
import { DeleteDeviceShadow } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import { GetDevice } from 'graphql/queries'
import { toast } from 'react-toastify'

import ConfirmationModal from 'components/modal/confirmation'

export const useRemoveDeviceShadow = ({ deviceId, displayName }) => {
  const [deleteDeviceShadow] = useMutation(DeleteDeviceShadow)
  const { selectedProject } = useStateContext()
  const { openModal } = useModal()
  return useCallback(async () => {
    const deleteShadow = async () => {
      const success = await deleteDeviceShadow({
        variables: {
          projectId: selectedProject.id,
          deviceId: deviceId,
          displayName: displayName
        },
        refetchQueries: [GetDevice] // TODO: Refresh project cache
      })
      if (success.data.deleteDeviceShadow) {
        toast.success('Successfully removed device shadow')
      } else {
        toast.error('An error occurred trying to remove the device shadow')
      }
    }

    await openModal(
      <ConfirmationModal
        title="Remove Device Shadow"
        message={`Are you sure you want to remove device shadow"${displayName}"?`}
        danger={true}
        onAccept={deleteShadow}
      />
    )
  }, [deleteDeviceShadow, deviceId, displayName, openModal, selectedProject])
}
