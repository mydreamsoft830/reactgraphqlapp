import { useMutation } from '@apollo/client'
import { Form, SubmitButton, TextField } from 'components/form'
import { useModal } from 'context/modal'
import { useStateContext } from 'context/state'
import { CreateDeviceShadow } from 'graphql/mutations'
import { GetDevice } from 'graphql/queries'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import './style.scss'

export const AddDeviceShadowModal = ({ device }) => {
  const { selectedProject } = useStateContext()
  const { closeModal } = useModal()
  console.dir(device)
  // eslint-disable-next-line no-empty-pattern
  const [doCreateDeviceShadow] = useMutation(CreateDeviceShadow)

  const onSubmit = useCallback(
    async params => {
      console.dir('submit')
      const result = await doCreateDeviceShadow({
        variables: {
          ...params,
          projectId: selectedProject.id,
          deviceId: device.id
        },
        refetchQueries: [GetDevice]
      })

      console.dir(result)
      toast.success('Successfully created device shadow')
      closeModal()
      return true
    },
    [closeModal, doCreateDeviceShadow, selectedProject, device]
  )

  return (
    <div className='add-device-shadow-modal'>
      <h1>Add Device Shadow</h1>
      <Form initialState={{ displayName: '' }} onSubmit={onSubmit}>
        <TextField label='Display Name' field='displayName' required={true} />
        <div className='action'>
          <SubmitButton label='Add Device Shadow'></SubmitButton>
        </div>
      </Form>
    </div>
  )
}
