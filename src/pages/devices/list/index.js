import { useCallback, useEffect } from 'react'
import {
  TabHeader,
  TabDescription,
  TabButtonContainer
} from 'components/tab_header'
import Button from 'components/button'
import CallToAction, {
  CallToActionHeader,
  CallToActionDescription,
  CallToActionImage
} from 'components/call_to_action'
import { MdOutlineImportantDevices } from 'react-icons/md'
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody
} from 'components/table'
import AddDeviceModal from 'components/modal/add_device'
import { useModal } from 'context/modal'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdDeviceUnknown } from 'react-icons/md'
import { GrView } from 'react-icons/gr'
import Dropdown, { DropdownItem, DropdownSeparator } from 'components/dropdown'
import { GetDevices } from 'graphql/queries'
import { useQuery } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tabs, Tab } from 'components/tabs'
import { LoadingFullFrame } from 'components/loading'
import { useRemoveDevice } from 'hooks/device'
import Error from 'components/error'

import './list.scss'

const DeviceRow = ({ device: { id, displayName, type } }) => {
  const navigate = useNavigate()
  const removeDevice = useRemoveDevice({ id, displayName })

  const openDevice = useCallback(() => {
    navigate(`/devices/${id}`)
  }, [navigate, id])

  return (
    <tr>
      <td>
        <div className="device-name" onClick={openDevice}>
          <span>
            <MdDeviceUnknown />
          </span>
          <div>
            <span>{displayName}</span>
            <span>{id}</span>
          </div>
        </div>
      </td>

      <td className="device-type">{type}</td>

      <td>
        <Dropdown>
          <DropdownItem name="View" icon={<GrView />} onClick={openDevice} />
          <DropdownSeparator />

          <DropdownItem
            name="Delete"
            icon={<RiDeleteBinLine />}
            className="red"
            onClick={removeDevice}
          />
        </Dropdown>
      </td>
    </tr>
  )
}

const DeviceList = () => {
  const { openModal } = useModal()
  const { selectedProject } = useStateContext()
  const location = useLocation()

  const { loading, error, data } = useQuery(GetDevices, {
    variables: {
      projectId: selectedProject.id
    }
  })

  const openAddDevice = useCallback(() => {
    openModal(() => <AddDeviceModal />, { padding: false })
  }, [openModal])

  useEffect(() => {
    if (location.pathname.endsWith('/create')) {
      openAddDevice()
    }
  }, [location, openAddDevice])

  if (loading) return <LoadingFullFrame />
  if (error) return <Error error={error} />

  const devices = data.devices || []

  return (
    <>
      <h1>Devices</h1>

      <Tabs>
        <Tab name="All Devices" path="list" index />
      </Tabs>

      <TabHeader>
        <TabDescription>
          Manage the lifecycle of your provisioned devices and add new devices
          to expand your network.
        </TabDescription>

        <TabButtonContainer>
          <Button onClick={openAddDevice}>Add New Device</Button>
        </TabButtonContainer>
      </TabHeader>

      {devices.length === 0 ? (
        <CallToAction>
          <CallToActionImage>
            <MdOutlineImportantDevices />
          </CallToActionImage>
          <CallToActionHeader>
            You don't have any devices yet.
          </CallToActionHeader>
          <CallToActionDescription>
            All of the devices in your project can be managed here.
          </CallToActionDescription>
          <CallToActionDescription>
            <Button onClick={openAddDevice}>Add New Device</Button>
          </CallToActionDescription>
        </CallToAction>
      ) : (
        <Table>
          <TableHeader>
            <TableHeaderColumn width={'50%'}>Name</TableHeaderColumn>
            <TableHeaderColumn>Type</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <DeviceRow key={device.id} device={device} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default DeviceList
