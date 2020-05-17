import { useCallback } from 'react'
import { DeleteDashboardWidget } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import { GetDashboardInfo } from 'graphql/queries'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import ConfirmationModal from 'components/modal/confirmation'
import { useDashboardContext } from 'pages/dashboard/view/dashboard_context'

export const useRemoveDashboardWidget = ({ id, displayName }) => {
    const [doDeleteDashboardWidget] = useMutation(DeleteDashboardWidget)
    const { selectedProject } = useStateContext()
    const { selectedDashboardId } = useDashboardContext()
    const { openModal } = useModal()
    const navigate = useNavigate()

    return useCallback(async () => {
        const deleteDashboardWidget = async () => {
            try {
                const result = await doDeleteDashboardWidget({
                    variables: {
                        projectId: selectedProject.id,
                        dashboardId: selectedDashboardId,
                        dashboardWidgetId: id
                    },
                    refetchQueries: [GetDashboardInfo] // TODO: Refresh project cache
                })
                if (result.data.deleteDashboardWidget === true) {
                    toast.success('Successfully removed widget')
                }

            } catch (e) {
                toast.error(`Error removing widget. ${e.message}`)
            }

            navigate(`/dashboard/${selectedDashboardId}`)
        }

        await openModal(
            <ConfirmationModal
                title="Remove Widget"
                message={`Are you sure you want to remove Widget "${displayName}"?`}
                danger={true}
                onAccept={deleteDashboardWidget}
            />
        )
    }, [doDeleteDashboardWidget, id, displayName, openModal, selectedProject, selectedDashboardId, navigate])
}
