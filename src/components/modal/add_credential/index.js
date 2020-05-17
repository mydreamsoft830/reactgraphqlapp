import { useCallback } from 'react'
import { Form } from 'components/form'
import { MultistepContainer, Step } from 'components/multistep'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import {
  useLocalStateContext,
  withLocalStateContext
} from 'context/local_state'
import {
  GenerateDeviceKeypairCredential,
  GenerateDevicePlaintextCredential
} from 'graphql/mutations'
import { GetDevice } from 'graphql/queries'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

import Step0 from './step_0'
import Step1 from './step_1'
import Step2GenerateNew from './step_2_generate_new'
import Step1GeneratePlaintext from './step_1_generate_plaintext'
import Step2GeneratePlaintext from './step_2_generate_plaintext'

import './add_keypair.scss'

const AddKeypairModal = withLocalStateContext(
  ({ device }) => {
    const { selectedProject } = useStateContext()
    const {
      state: { mode },
      setLocalValue
    } = useLocalStateContext()

    const [
      doCreateKeypair,
      { loading: loadingKeypair, error: errorKeypair }
    ] = useMutation(GenerateDeviceKeypairCredential)
    const [
      doCreatePlaintext,
      { loading: loadingPlaintext, error: errorPlaintext }
    ] = useMutation(GenerateDevicePlaintextCredential)

    const doSubmit = useCallback(
      async (deviceParams) => {
        if (mode === 'generatePlaintext') {
          const result = await doCreatePlaintext({
            variables: {
              deviceId: device.id,
              projectId: selectedProject.id,
              displayName: deviceParams.displayName,
              length: parseInt(deviceParams.length)
            },
            refetchQueries: [GetDevice]
          })

          setLocalValue(
            'plaintextResponse',
            result.data.generateDevicePlaintextCredential
          )

          toast.success('Successfully created keypair')

          mixpanel.track('Created plaintext credential', {
            deviceId: device.id,
            projectId: selectedProject.id,
            displayName: deviceParams.displayName,
            length: parseInt(deviceParams.length)
          })

          return true
        } else {
          const generateKeypair = mode !== 'uploadNew'

          const result = await doCreateKeypair({
            variables: {
              deviceId: device.id,
              projectId: selectedProject.id,
              displayName: deviceParams.displayName,
              publicKey: deviceParams.publicKey,
              generateKeypair
            },
            refetchQueries: [GetDevice]
          })

          setLocalValue(
            'keypairResponse',
            result.data.generateDeviceKeypairCredential
          )

          toast.success('Successfully created keypair')

          mixpanel.track('Created keypair credential', {
            deviceId: device.id,
            projectId: selectedProject.id,
            displayName: deviceParams.displayName,
            publicKey: deviceParams.publicKey,
            generateKeypair
          })

          return true
        }
      },
      [
        doCreateKeypair,
        doCreatePlaintext,
        selectedProject,
        setLocalValue,
        mode,
        device
      ]
    )

    const formErrors =
      (errorKeypair ? errorKeypair.graphQLErrors[0].errors : null) ||
      (errorPlaintext ? errorPlaintext.graphQLErrors[0].errors : null)

    return (
      <Form
        initialState={{ displayName: '', length: 32 }}
        onSubmit={doSubmit}
        errors={formErrors}
        loading={loadingKeypair || loadingPlaintext}
      >
        <MultistepContainer>
          <Step index={0}>
            <Step0 />
          </Step>
          <Step index={1}>
            {mode === 'generatePlaintext' ? (
              <Step1GeneratePlaintext device={device} />
            ) : (
              <Step1 device={device} />
            )}
          </Step>
          <Step index={2}>
            {mode === 'generatePlaintext' ? (
              <Step2GeneratePlaintext device={device} />
            ) : (
              <Step2GenerateNew device={device} />
            )}
          </Step>
        </MultistepContainer>
      </Form>
    )
  },
  { mode: null }
)

export default AddKeypairModal
