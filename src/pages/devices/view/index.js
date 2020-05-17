import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingFullFrame } from 'components/loading'
import { useQuery } from '@apollo/client'
import { useStateContext } from 'context/state'
import { GetDevice } from 'graphql/queries'
import { Tabs, Tab } from 'components/tabs'
import { Routes, Route } from 'react-router-dom'
import DetailPageHeader from 'components/detail_page_header'
import { AiOutlineDown } from 'react-icons/ai'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineGeneratingTokens, MdDevices } from 'react-icons/md'
import {
  DropdownButton,
  DropdownItem,
  DropdownSeparator
} from 'components/dropdown'
import { useRemoveDevice } from 'hooks/device'
import { useAddCredential } from 'hooks/credential'
import Error from 'components/error'

import DeviceDetails from './details'
import DeviceHistory from './history'
import DeviceCredentials from './credentials'
import mixpanel from 'mixpanel-browser'
import { DeviceShadows } from './shadow'
import { useModal } from 'context/modal'
import { AddDeviceShadowModal } from './add-shadow-modal'

const DeviceActions = ({ device }) => {
  const removeDevice = useRemoveDevice(device)
  const addCredential = useAddCredential(device)
  const { openModal } = useModal()

  const openAddDeviceShadow = useCallback(() => {
    openModal(() => <AddDeviceShadowModal device={device} />, {
      padding: false
    })
  }, [openModal, device])

  const buttonContent = useMemo(
    () => (
      <>
        Actions <AiOutlineDown />
      </>
    ),
    []
  )

  return (
    <DropdownButton buttonContent={buttonContent}>
      <DropdownItem
        name='Add Credential'
        icon={<MdOutlineGeneratingTokens />}
        onClick={addCredential}
      />

      <DropdownItem
        name='Add Device Shadow'
        icon={<MdDevices />}
        onClick={openAddDeviceShadow}
      />

      <DropdownSeparator />

      <DropdownItem
        name='Delete Device'
        icon={<RiDeleteBinLine />}
        className='red'
        onClick={removeDevice}
      />
    </DropdownButton>
  )
}

const DeviceView = () => {
  const { deviceId } = useParams()
  const { selectedProject } = useStateContext()

  const { loading, error, data } = useQuery(GetDevice, {
    variables: {
      projectId: selectedProject.id,
      deviceId: deviceId
    }
  })

  useEffect(() => {
    mixpanel.track('View device', {
      projectId: selectedProject.id,
      deviceId: deviceId
    })
  }, [selectedProject, deviceId])

  if (loading) return <LoadingFullFrame />
  if (error) return <Error error={error} />

  const device = data.device

  return (
    <>
      <DetailPageHeader
        text={device.displayName}
        backUrl='/devices'
        backPageName='Devices'
        actionButton={<DeviceActions device={device} />}
      >
        ID: <code>{device.id}</code>
      </DetailPageHeader>

      <Tabs>
        <Tab name='Details' path='details' index />
        <Tab name='Credentials' path='credentials' />
        <Tab name='Device Shadows' path='shadows' />
        {/* <Tab name="History" path="history" /> */}
      </Tabs>

      <Routes>
        <Route index element={<DeviceDetails device={device} />} />
        <Route path='details' element={<DeviceDetails device={device} />} />
        <Route
          path='credentials'
          element={<DeviceCredentials device={device} />}
        />
        <Route path='history' element={<DeviceHistory device={device} />} />
        <Route path='shadows' element={<DeviceShadows device={device} />} />
      </Routes>
    </>
  )
}

export default DeviceView
