import { useCallback } from 'react'
import { Form } from 'components/form'
import { CreateDevice } from 'graphql/mutations'
import { GetDevices } from 'graphql/queries'
import { MultistepContainer, Step } from 'components/multistep'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import {
  useLocalStateContext,
  withLocalStateContext
} from 'context/local_state'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

import Step0 from './step_0'
import Step1 from './step_1'
import Step2 from './step_2'

import './add_device.scss'

const AddDeviceModal = withLocalStateContext(() => {
  const { selectedProject } = useStateContext()
  const { setLocalValue } = useLocalStateContext()
  const [doCreateDevice, { loading, error }] = useMutation(CreateDevice)

  const doSubmit = useCallback(
    async (deviceParams) => {
      const result = await doCreateDevice({
        variables: {
          ...deviceParams,
          projectId: selectedProject.id
        },
        refetchQueries: [GetDevices]
      })

      setLocalValue('device', result.data.createDevice)

      toast.success('Successfully created device')

      mixpanel.track('Created device', {
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        ...deviceParams
      })

      return true
    },
    [doCreateDevice, selectedProject, setLocalValue]
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
        <Step index={1}>
          <Step1 />
        </Step>
        <Step index={2}>
          <Step2 />
        </Step>
      </MultistepContainer>
    </Form>
  )
})

export default AddDeviceModal
