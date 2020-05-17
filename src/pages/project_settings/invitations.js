import { useCallback } from 'react'
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody
} from 'components/table'
import {
  TabHeader,
  TabDescription,
  TabButtonContainer
} from 'components/tab_header'
import Button from 'components/button'
import InviteMemberModal from 'components/modal/invite_member'
import ConfirmationModal from 'components/modal/confirmation'
import { useModal } from 'context/modal'
import PermissionItem from 'components/table/permission_item'
import Dropdown, { DropdownItem } from 'components/dropdown'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { GetProject } from 'graphql/queries'
import { DeleteProjectInvite } from 'graphql/mutations'
import Date from 'components/date'
import CallToAction, {
  CallToActionHeader,
  CallToActionDescription,
  CallToActionImage
} from 'components/call_to_action'
import { FcInvite } from 'react-icons/fc'
import { toast } from 'react-toastify'

const ProjectInviteRow = ({
  pendingMember: { email, permissions, expiresAt }
}) => {
  const [doDeleteProjectInvite] = useMutation(DeleteProjectInvite)
  const { selectedProject } = useStateContext()
  const { openModal } = useModal()
  const readPermissions = permissions.filter((p) => p.startsWith('read:'))
  const writePermissions = permissions.filter((p) => p.startsWith('write:'))

  const removeInvite = useCallback(async () => {
    const deleteInvite = async () => {
      await doDeleteProjectInvite({
        variables: {
          projectId: selectedProject.id,
          email
        },
        refetchQueries: [GetProject]
      })

      toast.success('Successfully removed invite')
    }

    await openModal(
      <ConfirmationModal
        title="Remove Invite"
        message={`Are you sure you want to remove the invite for ${email}?`}
        danger={true}
        onAccept={deleteInvite}
      />
    )
  }, [doDeleteProjectInvite, email, openModal, selectedProject])

  return (
    <tr>
      <td style={{ fontWeight: 500 }}>{email}</td>

      <td>
        <Date time={expiresAt} />
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
            name="Delete"
            icon={<RiDeleteBinLine />}
            className="red"
            onClick={removeInvite}
          />
        </Dropdown>
      </td>
    </tr>
  )
}

const Invitations = ({ project }) => {
  const { openModal } = useModal()

  const openInviteMember = useCallback(() => {
    openModal(() => <InviteMemberModal />)
  }, [openModal])

  return (
    <>
      <TabHeader>
        <TabDescription>Manage invitations to join this project</TabDescription>

        <TabButtonContainer>
          <Button onClick={openInviteMember}>Invite user</Button>
        </TabButtonContainer>
      </TabHeader>

      {project.pendingMembers.length === 0 ? (
        <CallToAction>
          <CallToActionImage>
            <FcInvite />
          </CallToActionImage>
          <CallToActionHeader>
            You don't have any invitations yet.
          </CallToActionHeader>
          <CallToActionDescription>
            Invite another user to collaborate on a project.
          </CallToActionDescription>
        </CallToAction>
      ) : (
        <Table>
          <TableHeader>
            <TableHeaderColumn width={'50%'}>E-mail</TableHeaderColumn>
            <TableHeaderColumn>Expires On</TableHeaderColumn>
            <TableHeaderColumn>Permissions</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {project.pendingMembers.map((pendingMember) => (
              <ProjectInviteRow
                key={pendingMember.email}
                pendingMember={pendingMember}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default Invitations
