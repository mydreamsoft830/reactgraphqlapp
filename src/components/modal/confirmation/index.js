import { useCallback, useState } from 'react'
import { useModal } from 'context/modal'
import Button, { OutlineButton, DangerButton } from 'components/button'

import './confirmation_modal.scss'

const ConfirmationModal = ({
  title,
  message,
  danger = false,
  onAccept = () => {}
}) => {
  const { closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  const cancel = useCallback(() => closeModal(false), [closeModal])
  const accept = useCallback(async () => {
    setLoading(true)
    await onAccept()
    closeModal(true)
  }, [closeModal, setLoading, onAccept])

  return (
    <div className="confirmation-modal">
      <h1>{title}</h1>

      <div className="confirmation-message">{message}</div>

      <div className="buttons">
        <OutlineButton onClick={cancel} disabled={loading}>
          Cancel
        </OutlineButton>
        {danger ? (
          <DangerButton onClick={accept} loading={loading}>
            {title}
          </DangerButton>
        ) : (
          <Button onClick={accept} loading={loading}>
            {title}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ConfirmationModal
