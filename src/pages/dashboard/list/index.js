import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { MdDeviceUnknown } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { GrView } from 'react-icons/gr'

import { GetProjectDashboards } from 'graphql/queries'

import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'

import {
  TabHeader,
  TabDescription,
  TabButtonContainer
} from 'components/tab_header'
import Button from 'components/button'
import AddDashboardModal from 'components/modal/add_dashboard'
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
import { Tabs, Tab } from 'components/tabs'
import Dropdown, { DropdownItem, DropdownSeparator } from 'components/dropdown'
import { useRemoveDashboard } from 'hooks/dashboard'
import './list.scss'

const DashboardRow = ({ dashboard }) => {
  const { id, displayName } = dashboard
  const navigate = useNavigate()
  const removeDashboard = useRemoveDashboard(dashboard)

  const openDashboard = useCallback(() => {
    navigate(`/dashboard/${id}`)
  }, [navigate, id])

  return (
    <tr>
      <td>
        <div className="dashboard-name" onClick={openDashboard}>
          <span>
            <MdDeviceUnknown />
          </span>
          <div>
            <span>{displayName}</span>
          </div>
        </div>
      </td>

      <td>
        <Dropdown>
          <DropdownItem name="View" icon={<GrView />} onClick={openDashboard} />
          <DropdownSeparator />

          <DropdownItem
            name="Delete"
            icon={<RiDeleteBinLine />}
            className="red"
            onClick={removeDashboard}
          />
        </Dropdown>
      </td>
    </tr>
  )
}

const DashboardList = () => {

  const { openModal } = useModal()

  const { selectedProjectId } = useStateContext()

  const { data } = useQuery(
    GetProjectDashboards,
    {
      variables: {
        projectId: selectedProjectId
      }
    }
  )

  const openAddDashboard = useCallback(() => {
    openModal(() => <AddDashboardModal />, { padding: false })
  }, [openModal])


  return (
    <>
      <h1>Dashboards</h1>

      <Tabs>
        <Tab name="All Dashboards" path="list" index />
      </Tabs>

      <TabHeader>
        <TabDescription>
          Manage the dashboards of current project
        </TabDescription>

        <TabButtonContainer>
          <Button onClick={openAddDashboard}>Add New Dashboard</Button>
        </TabButtonContainer>
      </TabHeader>

      {!data || data.dashboards.length === 0 ? (
        <CallToAction>
          <CallToActionImage>
            <MdOutlineImportantDevices />
          </CallToActionImage>
          <CallToActionHeader>
            You don't have any dashboard yet.
          </CallToActionHeader>
          <CallToActionDescription>
            All of the dashboards in your project can be managed here.
          </CallToActionDescription>
          <CallToActionDescription>
            <Button onClick={openAddDashboard}>Add New Dashboard</Button>
          </CallToActionDescription>
        </CallToAction>
      ) : (
        <Table>
          <TableHeader>
            <TableHeaderColumn width={'50%'}>Name</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {data.dashboards.map((dashboard, index) => (
              <DashboardRow key={index.toString()} dashboard={dashboard} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default DashboardList
