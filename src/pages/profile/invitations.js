import { useQuery } from '@apollo/client'
import { User } from 'graphql/queries'
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody
} from 'components/table'
import { TabHeader, TabDescription } from 'components/tab_header'
import { LoadingFullFrame } from 'components/loading'
import Date from 'components/date'
import PermissionItem from 'components/table/permission_item'
import Button, { OutlineButton } from 'components/button'
import { useAcceptInvite } from 'hooks/project_invite'
import CallToAction, {
  CallToActionHeader,
  CallToActionDescription,
  CallToActionImage
} from 'components/call_to_action'
import { FcInvite } from 'react-icons/fc'
import Error from 'components/error'

import './invitations.scss'

const InviteRow = ({ invite }) => {
  const {
    projectName,
    projectId,
    invitedByName,
    expiresAt,
    permissions
  } = invite
  const [acceptInvite, declineInvite] = useAcceptInvite(invite)

  const readPermissions = permissions.filter((p) => p.startsWith('read:'))
  const writePermissions = permissions.filter((p) => p.startsWith('write:'))

  return (
    <tr>
      <td className="invite-project-column">
        <div>
          <span>{projectName}</span>
          <span>{projectId}</span>
        </div>
      </td>

      <td>{invitedByName}</td>

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
        <div className="invite-action-buttons">
          <Button onClick={acceptInvite}>Accept</Button>
          <OutlineButton onClick={declineInvite}>Decline</OutlineButton>
        </div>
      </td>
    </tr>
  )
}

const Invitations = () => {
  const { loading, error, data } = useQuery(User)

  if (loading) return <LoadingFullFrame />
  if (error) return <Error error={error} />

  const invites = data.user.invites

  return (
    <>
      <TabHeader>
        <TabDescription>
          Accept invitations to join new projects and collaborate with others
        </TabDescription>
      </TabHeader>

      {invites.length === 0 ? (
        <CallToAction>
          <CallToActionImage>
            <FcInvite />
          </CallToActionImage>
          <CallToActionHeader>You don't have any invites.</CallToActionHeader>
          <CallToActionDescription>
            Invites will appear here when another user has invited you to join
            their project.
          </CallToActionDescription>
        </CallToAction>
      ) : (
        <Table>
          <TableHeader>
            <TableHeaderColumn width={'30%'}>Project Name</TableHeaderColumn>
            <TableHeaderColumn>Invited By</TableHeaderColumn>
            <TableHeaderColumn>Expires On</TableHeaderColumn>
            <TableHeaderColumn>Permissions</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <InviteRow key={invite.projectId} invite={invite} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default Invitations
