import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineImportantDevices } from 'react-icons/md'
import { useQuery, useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import { GetDevice } from 'graphql/queries'
import { UpdateDeviceShadow } from 'graphql/mutations'
import { Form, SubmitButton, CodeArea } from 'components/form'
import Button from 'components/button'
import { FormContext } from 'components/form/form'
import { DangerButton } from 'components/button'
import CallToAction, {
  CallToActionHeader,
  CallToActionDescription,
  CallToActionImage
} from 'components/call_to_action'
import { AddDeviceShadowModal } from '../add-shadow-modal'
import { useRemoveDeviceShadow } from 'hooks/shadow'

import { toast } from 'react-toastify'
import './style.scss'

export const DeviceShadows = () => {
  const { deviceId } = useParams()
  const { openModal } = useModal()
  const { selectedProject } = useStateContext()
  const [updateDeviceShadow] = useMutation(UpdateDeviceShadow)

  const [shadowList, setShadowList] = useState([])
  const [selectedShadow, setSelectedShadow] = useState(0)

  const { loading, error, data, refetch } = useQuery(GetDevice, {
    variables: {
      projectId: selectedProject.id,
      deviceId: deviceId
    },
    refetchQueries: [GetDevice]
  })

  const onClickShadow = index => {
    setSelectedShadow(index)
  }

  const openAddDeviceShadow = useCallback(() => {
    openModal(() => <AddDeviceShadowModal device={data.device} />, {
      padding: false
    })
  }, [openModal, data])

  const onSubmit = async params => {
    try {
      await updateDeviceShadow({
        variables: {
          desiredState: JSON.parse(params.desiredState),
          reportedState: JSON.parse(params.reportedState),
          projectId: selectedProject.id,
          deviceId: deviceId,
          displayName: shadowList[selectedShadow].displayName
        }
      })
      toast.success('Successfully created device shadow')
      refetch()
    } catch (e) {
      console.log('error:', e)
    }
  }

  useEffect(() => {
    if (!error) {
      setShadowList(data.device.shadows)
      refetch()
      if (selectedShadow >= data.device.shadows.length) {
        setSelectedShadow(0)
      }
    } else {
      setShadowList([])
    }
  }, [loading, error, data, refetch, selectedShadow])

  return (
    <>
      {shadowList.length > 0 ? (
        <div className='device-shadows'>
          <ul className='list'>
            {shadowList.length > 0 &&
              shadowList.map((shadow, index) => (
                <li
                  className={index === selectedShadow ? 'active' : ''}
                  key={index}
                  onClick={() => onClickShadow(index)}
                >
                  <div className='shadow-text'>{shadow.displayName}</div>
                  <div className='shadow-bottom-id'>{deviceId}</div>
                </li>
              ))}
          </ul>
          <div className='horizontal' />
          <Form initialState={{ desiredState: '' }} onSubmit={onSubmit}>
            <EditContent
              shadow={shadowList[selectedShadow]}
              deviceId={deviceId}
            />
          </Form>
        </div>
      ) : (
        <>
          <CallToAction>
            <CallToActionImage>
              <MdOutlineImportantDevices />
            </CallToActionImage>
            <CallToActionHeader>
              You don't have any device shadows yet.
            </CallToActionHeader>
            <CallToActionDescription>
              All of the devices shadows in your project can be managed here.
            </CallToActionDescription>
            <CallToActionDescription>
              <Button onClick={openAddDeviceShadow}>
                Add New Device Shadow
              </Button>
            </CallToActionDescription>
          </CallToAction>
        </>
      )}
    </>
  )
}

const EditContent = ({ shadow, deviceId }) => {
  const { formState, updateFormValue } = useContext(FormContext)

  const [isDesiredJson, setIsDesiredJson] = useState(false)
  const [isReportedJson, setIsReportedJson] = useState(false)
  const displayName = shadow?.displayName

  useEffect(() => {
    if (updateFormValue && shadow) {
      updateFormValue(
        'desiredState',
        shadow.desiredState ? JSON.stringify(shadow.desiredState, null, 2) : ''
      )
      updateFormValue(
        'reportedState',
        shadow.reportedState
          ? JSON.stringify(shadow.reportedState, null, 2)
          : ''
      )
    }
  }, [updateFormValue, shadow])

  useEffect(() => {
    const isDeJson = checkJson(formState.desiredState)
    const isRejson = checkJson(formState.reportedState)
    setIsDesiredJson(isDeJson)
    setIsReportedJson(isRejson)
  }, [formState.desiredState, formState.reportedState])

  const removeDeviceShadow = useRemoveDeviceShadow({ deviceId, displayName })

  const checkJson = object => {
    let isJson = false
    try {
      JSON.parse(object)
      isJson = true
    } catch (error) {}
    return isJson
  }

  return (
    <React.Fragment>
      {shadow ? (
        <div className='edit-content-main'>
          <div
            className={`${
              isDesiredJson || !formState.desiredState
                ? ''
                : 'invalid-json-border'
            }`}
          >
            <CodeArea
              field='desiredState'
              label='Desired State'
              placeholder=''
              minHeight={150}
              required={true}
            />
          </div>
          <div
            className={`${
              isReportedJson || !formState.reportedState
                ? ''
                : 'invalid-json-border'
            }`}
          >
            <CodeArea
              field='reportedState'
              label='Reported State'
              placeholder=''
              minHeight={150}
              required={true}
            />
          </div>
          <div className='action'>
            <SubmitButton label='Save Device Shadow'></SubmitButton>
            <div className='remove-btn'>
              <DangerButton onClick={removeDeviceShadow}>
                <RiDeleteBinLine />
              </DangerButton>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  )
}
