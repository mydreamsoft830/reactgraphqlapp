import { useEffect } from 'react'
import { ImCheckboxChecked } from 'react-icons/im'
import Button, { OutlineButton } from 'components/button'
import { useModal } from 'context/modal'
import DownloadableContent from 'components/downloadable_content'
import { useLocalStateContext } from 'context/local_state'

const Step2GenerateNew = () => {
  const { hideCloseButton, closeModal } = useModal()
  const {
    state: { keypairResponse }
  } = useLocalStateContext()

  useEffect(() => {
    hideCloseButton()
  }, [hideCloseButton])

  if (keypairResponse == null) return null

  const { displayName, publicKey } = keypairResponse.keypair
  const privateKeyPresent = keypairResponse.privateKey !== null

  return (
    <>
      <div className="success-header">
        <ImCheckboxChecked />
        <h2>Success</h2>
      </div>

      <div className="success-lower keypair-generate-success">
        <p>
          Your newly generated keypair is ready to go!
          {privateKeyPresent &&
            " Be sure to download it now as it can't be retrieved later."}
        </p>

        <div className="downloads">
          <DownloadableContent
            content={publicKey}
            filename={`${displayName}_publicKey.pem`}
          >
            <OutlineButton>Download Public Key</OutlineButton>
          </DownloadableContent>

          {privateKeyPresent && (
            <DownloadableContent
              content={keypairResponse.privateKey}
              filename={`${displayName}_privateKey.pem`}
            >
              <OutlineButton>Download Private Key</OutlineButton>
            </DownloadableContent>
          )}
        </div>

        <div className="success-footer">
          <Button onClick={closeModal}>Finish</Button>
        </div>
      </div>
    </>
  )
}

export default Step2GenerateNew
