import { useForm } from 'components/form/form'
import { LoadingFullFrame } from 'components/loading'
import { useMultistep } from 'components/multistep'
import { useCallback } from 'react'
import { AiOutlineRight } from 'react-icons/ai'

const Step0 = () => {
  const { setCurrentStep } = useMultistep()
  const { updateFormValue } = useForm()

  const onNextStepLegacy = useCallback(() => {
    updateFormValue('type', 'legacy')
    setCurrentStep(1)
  }, [updateFormValue, setCurrentStep])

  return (
    <div className="add-device-container">
      <h1>Add New Device</h1>

      <div className="device-discovery">
        <span>Discovered Devices</span>
        <div className="found-devices">
          <LoadingFullFrame message="Searching for Devices" />
        </div>
      </div>
      <div className="add-legacy-footer" onClick={onNextStepLegacy}>
        <span>Adding a non-Envirada device?</span>
        <span>Click here to add a Legacy device</span>
        <span className="next-icon">
          <AiOutlineRight />
        </span>
      </div>
    </div>
  )
}

export default Step0
