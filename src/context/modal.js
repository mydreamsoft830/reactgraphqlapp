import { createContext, useState, useContext, useRef, useCallback } from 'react'
import ModalContainer from 'components/modal/container'
export const ModalContext = createContext({})

export const ModalContextProvider = (props) => {
  const { children } = props

  const [modalClassname, setModalClassname] = useState('')
  const [modalInnerWideClassname, setModalInnerWideClassname] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [closeButtonVisible, setCloseButtonVisible] = useState(true)

  const modalCallback = useRef(null)

  const openModal = useCallback(
    (content, options = {}) => {
      const classNames = []
      let wideModal = options.modalSize
      if (wideModal){
        setModalInnerWideClassname('modal-inner-wide')
      }else{
        setModalInnerWideClassname('')
      }
      if (options.hasOwnProperty('padding') && !options.padding)
        classNames.push('no-padding')

      setModalClassname(classNames.join(' '))
      setModalContent(content)
      setCloseButtonVisible(true)
      setModalVisible(true)

      return new Promise((res) => {
        modalCallback.current = res
      })
    },
    [setModalContent, setModalVisible]
  )

  const hideCloseButton = useCallback(() => {
    if (modalVisible) setCloseButtonVisible(false)
  }, [modalVisible, setCloseButtonVisible])

  const showCloseButton = useCallback(() => {
    if (modalVisible) setCloseButtonVisible(false)
  }, [modalVisible, setCloseButtonVisible])

  const doModalCallback = useCallback(
    (result) => {
      if (modalCallback.current) modalCallback.current(result)

      modalCallback.current = null
      setModalVisible(false)

      setTimeout(() => setModalContent(null), 250)
    },
    [setModalContent, setModalVisible]
  )

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal: doModalCallback,
        hideCloseButton,
        showCloseButton
      }}>
      <ModalContainer
        visible={modalVisible}
        doModalCallback={doModalCallback}
        closeButtonVisible={closeButtonVisible}
        className={modalClassname}
        wideClassName={modalInnerWideClassname}>
        {modalContent}
      </ModalContainer>

      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
