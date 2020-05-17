import { useCallback } from 'react'
import { DeleteDeviceCredential } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import ConfirmationModal from 'components/modal/confirmation'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import { GetDevice } from 'graphql/queries'
import CreateAuthTokenModal from 'components/modal/create_auth_token'
import AddCredentialModal from 'components/modal/add_credential'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

export const useRemoveCredential = ({ id, deviceId }) => {
  const [doDeleteCredential] = useMutation(DeleteDeviceCredential)
  const { selectedProject } = useStateContext()
  const { openModal } = useModal()

  return useCallback(async () => {
    const deleteCredential = async () => {
      await doDeleteCredential({
        variables: {
          projectId: selectedProject.id,
          deviceId: deviceId,
          credentialId: id
        },
        refetchQueries: [GetDevice]
      })

      toast.success('Successfully removed credential')

      mixpanel.track('Removed credential', {
        projectId: selectedProject.id,
        deviceId: deviceId,
        credentialId: id
      })
    }

    await openModal(
      <ConfirmationModal
        title="Remove Credential"
        message={`Are you sure you want to remove this credential?`}
        danger={true}
        onAccept={deleteCredential}
      />
    )
  }, [doDeleteCredential, id, deviceId, openModal, selectedProject])
}

export const useCreateAuthToken = () => {
  const { openModal } = useModal()

  return useCallback(
    async (device, keypair) => {
      await openModal(
        <CreateAuthTokenModal device={device} keypair={keypair} />
      )
    },
    [openModal]
  )
}

export const useAddCredential = (device) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    await openModal(<AddCredentialModal device={device} />, { padding: false })
  }, [device, openModal])
}
