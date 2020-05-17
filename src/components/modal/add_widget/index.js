import { useCallback } from 'react'
import { Form } from 'components/form'
import { MultistepContainer, Step } from 'components/multistep'
import {
    useLocalStateContext,
    withLocalStateContext
} from 'context/local_state'
import { toast } from 'react-toastify'
import { CreateDashBoardWidget } from 'graphql/mutations'
import { GetDashboardInfo } from 'graphql/queries'

import { useStateContext } from 'context/state'
import { useMutation } from '@apollo/client'
import Step0 from './step_0'
import Step1 from './step_1'

import './add_widget.scss'
const initialLayout = { x: 0, y: 0, w: 6, h: 2 }

const AddWidgetModal = withLocalStateContext((props) => {
    const { selectedProject } = useStateContext()
    const { selectedDashboardId, widgetInfo } = props
    const {
        state: { widgetType }
    } = useLocalStateContext()
    const [doCreateWidget, { loading, error }] = useMutation(CreateDashBoardWidget)

    const doSubmit = useCallback(async (widgetParams) => {
        let query = [];
        let { displayName, graphType, toggleGraph, ...queryList } = widgetParams
        for (const key in queryList) {
            if (Object.hasOwnProperty.call(queryList, key)) {
                query.push(queryList[key])
            }
        }
        await doCreateWidget({
            variables: {
                ...widgetParams,
                projectId: selectedProject.id,
                dashboardId: selectedDashboardId,
                displayName: widgetParams.displayName,
                type: widgetType.value,
                configuration: { query, toggleGraph, graphType },
                position: initialLayout
            },
            refetchQueries: [GetDashboardInfo]
        })
        toast.success('Successfully created Widget')

        return true
    }, [doCreateWidget, selectedProject, selectedDashboardId, widgetType])

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
                    <Step0 widgetInfo={widgetInfo} />
                </Step>
                <Step index={1}>
                    <Step1 widgetType={widgetType} widgetInfo={widgetInfo} />
                </Step>
            </MultistepContainer>
        </Form>
    )
})

export default AddWidgetModal
