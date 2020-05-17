import { useMultistep } from 'components/multistep'
import { useCallback } from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import { useLocalStateContext } from 'context/local_state'

const Option = ({ title, text, onClick = () => {} }) => {
  return (
    <div className="option" onClick={onClick}>
      <div>
        <h6>{title}</h6>
        <p>{text}</p>
      </div>
      <div className="icon">
        <AiOutlineRight />
      </div>
    </div>
  )
}

const Step0 = () => {
  const { setCurrentStep } = useMultistep()
  const { setLocalValue } = useLocalStateContext()

  const nextStep = useCallback(
    (mode) => {
      setLocalValue('mode', mode)
      setCurrentStep(1)
    },
    [setLocalValue, setCurrentStep]
  )

  return (
    <div className="add-keypair-container">
      <h1>Add New Keypair</h1>

      <div className="options">
        <Option
          title="I want to generate a new keypair"
          text="The IoT core will generate a new keypair for you that can be downloaded to your device"
          onClick={() => nextStep('generateNew')}
        />
        <Option
          title="I want to upload a new public key"
          text="For when your device already has a provisioned keypair"
          onClick={() => nextStep('uploadNew')}
        />
        <Option
          title="I want to authenticate with a username and password"
          text="This option is best for legacy devices that are only able to support basic authentication"
          onClick={() => nextStep('generatePlaintext')}
        />
      </div>
    </div>
  )
}

export default Step0
