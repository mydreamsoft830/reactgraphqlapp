import { MultistepContainer, Step } from 'components/multistep'
import Step0 from './step_0'
import Step1 from './step_1'

import './create_auth_token.scss'
import { useEffect } from 'react'
import mixpanel from 'mixpanel-browser'

const CreateAuthTokenModal = ({ device, keypair }) => {
  useEffect(() => {
    mixpanel.track('Created auth token', {
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type
    })
  }, [device])

  return (
    <div className="create-auth-token">
      <MultistepContainer>
        <Step index={0}>
          <Step0 />
        </Step>
        <Step index={1}>
          <Step1 device={device} keypair={keypair} />
        </Step>
      </MultistepContainer>
    </div>
  )
}

export default CreateAuthTokenModal
