import { useCallback } from 'react'
import { DeleteDashboard } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import { GetProjectDashboards } from 'graphql/queries'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import ConfirmationModal from 'components/modal/confirmation'

export const useRemoveDashboard = ({ id, displayName }) => {
    const [doDeleteDashboard] = useMutation(DeleteDashboard)
    const { selectedProject } = useStateContext()
    const { openModal } = useModal()
    const navigate = useNavigate()

    return useCallback(async () => {
        const deleteDashboard = async () => {
            try {
                const result = await doDeleteDashboard({
                    variables: {
                        projectId: selectedProject.id,
                        dashboardId: id
                    },
                    refetchQueries: [GetProjectDashboards] // TODO: Refresh project cache
                })
                if (result.data.deleteDashboard === true) {
                    toast.success('Successfully removed dashoard')
                }

            } catch (e) {
                toast.error(`Error removing dashboard. ${e.message}`)
            }

            navigate('/dashboard/list')
        }

        await openModal(
            <ConfirmationModal
                title="Remove Dashboard"
                message={`Are you sure you want to remove Dashboard "${displayName}"?`}
                danger={true}
                onAccept={deleteDashboard}
            />
        )
    }, [doDeleteDashboard, id, displayName, openModal, selectedProject, navigate])
}
