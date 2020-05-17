import { useCallback, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import useKeyPress from 'hooks/use_key_press'
import './modal_container.scss'

const ModalContainer = ({
  visible,
  closeButtonVisible,
  doModalCallback,
  children,
  className = '',
  wideClassName
}) => {
  const escapePressed = useKeyPress('Escape')
  const classNames = ['modal-container', ...className.split(' ')]

  const closeModal = useCallback(() => doModalCallback(false), [
    doModalCallback
  ])

  useEffect(() => {
    if (escapePressed) {
      closeModal()
    }
  }, [escapePressed, closeModal])

  if (visible) classNames.push('visible')

  return (
    <div className={classNames.join(' ')} onClick={closeModal}>
      <div className={`modal-inner ${wideClassName}`} onClick={(e) => e.stopPropagation()}>
        {closeButtonVisible && (
          <div className="close-button" onClick={closeModal}>
            <AiOutlineClose />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default ModalContainer
