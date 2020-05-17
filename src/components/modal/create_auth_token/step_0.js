import Button from 'components/button'
import { useMultistep } from 'components/multistep'

const Step0 = () => {
  const { nextStep } = useMultistep()

  return (
    <div className="auth-step-container">
      <h1>Create Auth Token</h1>
      <p>
        This will generate a new authentication token from the stored private
        key. This action will not invalidate any credentials obtained previously
        for this keypair.
      </p>
      <div className="button-footer">
        <Button onClick={nextStep}>Generate</Button>
      </div>
    </div>
  )
}

export default Step0
