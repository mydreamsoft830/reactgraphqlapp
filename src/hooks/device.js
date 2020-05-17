import { useCallback } from 'react'
import { DeleteDevice } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import { GetDevices } from 'graphql/queries'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import ConfirmationModal from 'components/modal/confirmation'

export const useRemoveDevice = ({ id, displayName }) => {
  const [doDeleteDevice] = useMutation(DeleteDevice)
  const { selectedProject } = useStateContext()
  const { openModal } = useModal()
  const navigate = useNavigate()

  return useCallback(async () => {
    const deleteDevice = async () => {
      await doDeleteDevice({
        variables: {
          projectId: selectedProject.id,
          deviceId: id
        },
        refetchQueries: [GetDevices] // TODO: Refresh project cache
      })

      toast.success('Successfully removed device')

      navigate('/devices')
    }

    await openModal(
      <ConfirmationModal
        title="Remove Device"
        message={`Are you sure you want to remove device "${displayName}"?`}
        danger={true}
        onAccept={deleteDevice}
      />
    )
  }, [doDeleteDevice, id, displayName, openModal, selectedProject, navigate])
}
