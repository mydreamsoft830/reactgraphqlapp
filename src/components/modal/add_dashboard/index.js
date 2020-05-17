import { useCallback } from 'react'
import { Form } from 'components/form'
import { AddProjectDashboard } from 'graphql/mutations'
import { GetProjectDashboards } from 'graphql/queries'
import { MultistepContainer, Step } from 'components/multistep'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import {
  useLocalStateContext,
  withLocalStateContext
} from 'context/local_state'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

import Step0 from './step'

import './add_dashboard.scss'

const AddDashboardModal = withLocalStateContext(() => {
  const { selectedProject } = useStateContext()
  const { setLocalValue } = useLocalStateContext()
  const [doCreateDashboard, { loading, error }] = useMutation(
    AddProjectDashboard
  )

  const doSubmit = useCallback(
    async dashboardParams => {
      const result = await doCreateDashboard({
        variables: {
          ...dashboardParams,
          projectId: selectedProject.id
        },
        refetchQueries: [GetProjectDashboards]
      })

      setLocalValue('dashboard', result.data.createDashboard)

      toast.success('Successfully created dashboard')

      mixpanel.track('Created dashboard', {
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        ...dashboardParams
      })

      return true
    },
    [doCreateDashboard, selectedProject, setLocalValue]
  )

  const formErrors = error ? error.graphQLErrors[0].errors : null

  return (
    <Form
      initialState={{ displayName: '' }}
      onSubmit={doSubmit}
      errors={formErrors}
      loading={loading}
    >
      <MultistepContainer>
        <Step index={0}>
          <Step0 />
        </Step>
      </MultistepContainer>
    </Form>
  )
})

export default AddDashboardModal
