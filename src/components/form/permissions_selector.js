import { useContext, useCallback } from 'react'
import { FormContext } from './form'

import './permissions_selector.scss'

const ALL_PERMISSIONS = [
  {
    token: 'read:project',
    name: 'Read Project',
    description: 'Read project settings'
  },
  {
    token: 'write:project',
    name: 'Write Project',
    description: 'Manage the project including user membership'
  },
  {
    token: 'read:device',
    name: 'Read Devices',
    description: 'Read devices in this project'
  },
  {
    token: 'write:device',
    name: 'Write Devices',
    description: 'Create and manage devices in this project'
  },
  {
    token: 'read:rule',
    name: 'Read Rules',
    description: 'Read rules in this project'
  },
  {
    token: 'write:rule',
    name: 'Write Rules',
    description: 'Create and manage rules in this project'
  },
  {
    token: 'read:timeseries',
    name: 'Read Timeseries Data',
    description: 'Read Timeseries in this project'
  },
  {
    token: 'write:timeseries',
    name: 'Write Timeseries',
    description: 'Create and manage Timeseries in this project'
  },
  {
    token: 'read:activity',
    name: 'Read Activity',
    description: 'Read published messages in the activity feed'
  },
  {
    token: 'write:activity',
    name: 'Write Activity',
    description: 'Publish messages from the activity screen'
  }
]

const PermissionsSelector = ({ field, label = 'Permissions' }) => {
  const { formState, updateFormValue, errors } = useContext(FormContext)

  const classNames = ['text-field']
  const fieldErrors =
    errors && errors[field] && errors[field].map((error) => `${label} ${error}`)

  if (fieldErrors) classNames.push('error')

  const isPermissionSelected = useCallback(
    (permission) => formState[field].includes(permission),
    [formState, field]
  )

  const togglePermission = useCallback(
    (token) => {
      const selected = isPermissionSelected(token)

      if (!selected) {
        updateFormValue(field, [...formState[field], token])
      } else {
        updateFormValue(
          field,
          formState[field].filter((permission) => permission !== token)
        )
      }
    },
    [updateFormValue, field, formState, isPermissionSelected]
  )

  return (
    <div className="permissions-selector">
      <label>{label}</label>

      {ALL_PERMISSIONS.map(({ token, name, description }) => (
        <div key={token} onClick={() => togglePermission(token)}>
          <input
            type="checkbox"
            name={token}
            value={token}
            checked={isPermissionSelected(token)}
            readOnly
          />
          <div>
            <span className="name">{name}</span>
            <span className="description">{description}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PermissionsSelector
