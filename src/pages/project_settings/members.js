import { useCallback } from 'react'
import {
  TabHeader,
  TabDescription,
  TabButtonContainer
} from 'components/tab_header'
import Button from 'components/button'
import InviteMemberModal from 'components/modal/invite_member'
import ConfirmationModal from 'components/modal/confirmation'
import AssignPermissionsModal from 'components/modal/assign_permissions'

import { useModal } from 'context/modal'
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody
} from 'components/table'
import PermissionItem from 'components/table/permission_item'
import Dropdown, { DropdownItem, DropdownSeparator } from 'components/dropdown'
import { RiDeleteBinLine } from 'react-icons/ri'
import { BsCheck2Square } from 'react-icons/bs'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { GetProject } from 'graphql/queries'
import { DeleteProjectMember } from 'graphql/mutations'
import { toast } from 'react-toastify'

const UserRow = ({
  member: {
    user,
    projectPermission: { permissions }
  }
}) => {
  const [doDeleteProjectMember] = useMutation(DeleteProjectMember)
  const { selectedProject } = useStateContext()
  const { openModal } = useModal()

  const readPermissions = permissions.filter((p) => p.startsWith('read:'))
  const writePermissions = permissions.filter((p) => p.startsWith('write:'))

  const openAssignPermissions = useCallback(() => {
    openModal(() => (
      <AssignPermissionsModal user={user} permissions={permissions} />
    ))
  }, [openModal, user, permissions])

  const openRemoveMemberModal = useCallback(async () => {
    const deleteMember = async () => {
      try {
        await doDeleteProjectMember({
          variables: {
            projectId: selectedProject.id,
            memberId: user.id
          },
          refetchQueries: [GetProject]
        })

        toast.success('Successfully removed member')
      } catch (e) {
        toast.error(`Error removing member. ${e.message}`)
      }
    }

    await openModal(
      <ConfirmationModal
        title="Remove Member"
        message={`Are you sure you want to remove "${user.name}" from this project?`}
        danger={true}
        onAccept={deleteMember}
      />
    )
  }, [doDeleteProjectMember, openModal, selectedProject, user])

  return (
    <tr>
      <td>
        <div className="user">
          <div className="avatar">
            <img src={user.pictureUrl} alt={`User avatar for ${user.name}`} />
          </div>
          <div>
            <div>{user.name}</div>
            <div>{user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="permissions">
          <div>
            {readPermissions.map((token) => (
              <PermissionItem key={token} token={token} />
            ))}
          </div>

          <div>
            {writePermissions.map((token) => (
              <PermissionItem key={token} token={token} />
            ))}
          </div>
        </div>
      </td>

      <td>
        <Dropdown>
          <DropdownItem
            name="Assign Permissions"
            icon={<BsCheck2Square />}
            onClick={openAssignPermissions}
          />
          <DropdownSeparator />
          <DropdownItem
            name="Delete"
            icon={<RiDeleteBinLine />}
            className="red"
            onClick={openRemoveMemberModal}
          />
        </Dropdown>
      </td>
    </tr>
  )
}

const Members = ({ project }) => {
  const { openModal } = useModal()

  const openInviteMember = useCallback(() => {
    openModal(() => <InviteMemberModal />)
  }, [openModal])

  return (
    <>
      <TabHeader>
        <TabDescription>
          Manage the members of this project and assign permissions for them to
          access resources.
        </TabDescription>

        <TabButtonContainer>
          <Button onClick={openInviteMember}>Invite Member</Button>
        </TabButtonContainer>
      </TabHeader>

      <Table>
        <TableHeader>
          <TableHeaderColumn width={'50%'}>Name</TableHeaderColumn>
          <TableHeaderColumn>Permissions</TableHeaderColumn>
          <TableHeaderColumn></TableHeaderColumn>
        </TableHeader>
        <TableBody>
          {project.members.map((member) => (
            <UserRow key={member.user.id} member={member} />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Members
