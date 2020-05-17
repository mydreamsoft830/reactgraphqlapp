import CallToAction, {
  CallToActionHeader,
  CallToActionDescription,
  CallToActionImage
} from 'components/call_to_action'
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody
} from 'components/table'
import Dropdown, { DropdownItem, DropdownSeparator } from 'components/dropdown'
import Button from 'components/button'
import { MdOutlineGeneratingTokens } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { AiOutlineFileText } from 'react-icons/ai'
import { GrCertificate } from 'react-icons/gr'
import Date from 'components/date'
import {
  useRemoveCredential,
  useCreateAuthToken,
  useAddCredential
} from 'hooks/credential'
import {
  TabHeader,
  TabDescription,
  TabButtonContainer
} from 'components/tab_header'

const KeypairRow = ({ device, credential }) => {
  const { id, displayName, createdAt } = credential
  const removeCredential = useRemoveCredential({ deviceId: device.id, id })
  const createAuthToken = useCreateAuthToken()

  return (
    <tr>
      <td>
        <div className="device-name">
          <span>
            <GrCertificate />
          </span>
          <div>
            <span>{displayName}</span>
            <span>{id}</span>
          </div>
        </div>
      </td>

      <td>Keypair</td>

      <td>
        <Date time={createdAt} />
      </td>

      <td>
        <Dropdown>
          <DropdownItem
            name="Create Auth Token"
            icon={<MdOutlineGeneratingTokens />}
            onClick={() => createAuthToken(device, credential)}
          />

          <DropdownSeparator />

          <DropdownItem
            name="Delete"
            icon={<RiDeleteBinLine />}
            className="red"
            onClick={removeCredential}
          />
        </Dropdown>
      </td>
    </tr>
  )
}

const PlaintextRow = ({ device, credential }) => {
  const { id, displayName, createdAt } = credential
  const removeCredential = useRemoveCredential({ deviceId: device.id, id })

  return (
    <tr>
      <td>
        <div className="device-name">
          <span>
            <AiOutlineFileText />
          </span>
          <div>
            <span>{displayName}</span>
            <span>{id}</span>
          </div>
        </div>
      </td>

      <td>Plaintext</td>

      <td>
        <Date time={createdAt} />
      </td>

      <td>
        <Dropdown>
          <DropdownItem
            name="Delete"
            icon={<RiDeleteBinLine />}
            className="red"
            onClick={removeCredential}
          />
        </Dropdown>
      </td>
    </tr>
  )
}

const CredentialRow = ({ credential, device }) => {
  switch (credential.__typename) {
    case 'DeviceKeypairCredential':
      return <KeypairRow device={device} credential={credential} />
    case 'DevicePlaintextCredential':
      return <PlaintextRow device={device} credential={credential} />
    default:
      return null
  }
}

const DeviceKeypairs = ({ device }) => {
  const credentials = device.credentials
  const openAddCredential = useAddCredential(device)

  return (
    <>
      <TabHeader>
        <TabDescription>
          Credentials are used to authorize your device so it can connect to the
          IoT Core.
        </TabDescription>

        {credentials.length > 0 && (
          <TabButtonContainer>
            <Button onClick={openAddCredential}>Add New Credential</Button>
          </TabButtonContainer>
        )}
      </TabHeader>

      {credentials.length === 0 ? (
        <CallToAction>
          <CallToActionImage></CallToActionImage>
          <CallToActionHeader>
            You haven't created any credentials yet.
          </CallToActionHeader>
          <CallToActionDescription>
            Credentials are required for your device to authenticate with the
            IoT core.
          </CallToActionDescription>
          <CallToActionDescription>
            <Button onClick={openAddCredential}>Add New Credential</Button>
          </CallToActionDescription>
        </CallToAction>
      ) : (
        <Table>
          <TableHeader>
            <TableHeaderColumn width={'50%'}>Friendly Name</TableHeaderColumn>
            <TableHeaderColumn>Type</TableHeaderColumn>
            <TableHeaderColumn>Created on</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {credentials.map((credential) => (
              <CredentialRow
                key={credential.id}
                device={device}
                credential={credential}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default DeviceKeypairs
