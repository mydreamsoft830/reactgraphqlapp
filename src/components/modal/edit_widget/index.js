import { useCallback } from 'react'
import { Form } from 'components/form'
import { MultistepContainer, Step } from 'components/multistep'
import {
    useLocalStateContext,
    withLocalStateContext
} from 'context/local_state'
import { toast } from 'react-toastify'
import { UpdateDashboardWidget } from 'graphql/mutations'
import { GetDashboardInfo } from 'graphql/queries'

import { useStateContext } from 'context/state'
import { useMutation } from '@apollo/client'
import Step0 from './step_0'
import './edit_widget.scss'

const EditWidgetModal = withLocalStateContext((props) => {
    const { selectedProject } = useStateContext()
    const { selectedDashboardId, widgetInfo, setMultiQueryVariables } = props
    const {
        state: { widgetType }
    } = useLocalStateContext()
    const [updateDashboardWidget, { loading, error }] = useMutation(UpdateDashboardWidget)

    const doSubmit = useCallback(async (widgetParams) => {
        let query = [];
        let { displayName, toggleGraph, graphType, ...queryList } = widgetParams
        for (const key in queryList) {
            if (Object.hasOwnProperty.call(queryList, key)) {
                queryList[key] && query.push(queryList[key])
            }
        }
        await updateDashboardWidget({
            variables: {
                projectId: selectedProject.id,
                dashboardId: selectedDashboardId,
                dashboardWidgetId: widgetInfo.id,
                displayName: widgetParams.displayName,
                type: widgetInfo.type,
                configuration: { query, toggleGraph, graphType },
                position: {
                    x: widgetInfo.position.x,
                    y: widgetInfo.position.y,
                    w: widgetInfo.position.w,
                    h: widgetInfo.position.h,
                }
            },
            refetchQueries: [GetDashboardInfo]
        })
        toast.success('Successfully edited Widget')
        setMultiQueryVariables(vars => {
            return Object.assign(
                {},
                vars,
                widgetInfo.type === 'GRAPH' ?
                    { queries: query } : { query: query[0] }
            )
        })
        return true
    }, [selectedProject, selectedDashboardId, widgetInfo, updateDashboardWidget, setMultiQueryVariables])

    const formErrors = error ? error.graphQLErrors[0].errors : null

    return (
        <Form
            initialState={{ displayName: '', graphType: 'line' }}
            onSubmit={doSubmit}
            errors={formErrors}
            loading={loading}
        >
            <MultistepContainer>
                <Step index={0}>
                    <Step0 widgetType={widgetType} widgetInfo={widgetInfo} />
                </Step>
            </MultistepContainer>
        </Form>
    )
})

export default EditWidgetModal
