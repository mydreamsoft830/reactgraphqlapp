import { useCallback, useContext } from 'react'
import { FormContext } from './form'

import { IoCodeSlashOutline } from 'react-icons/io5'
import { FiSearch } from 'react-icons/fi'
import { AiOutlineCheck } from 'react-icons/ai'

import './environment_selector.scss'

const EnvironmentSelectItem = ({
  icon,
  value,
  label,
  description,
  selected,
  onSelect
}) => {
  const classNames = ['environment-select-item']

  if (selected) classNames.push('selected')

  return (
    <div className={classNames.join(' ')} onClick={() => onSelect(value)}>
      <div>{icon}</div>
      <div>
        <div>{label}</div>
        <div>{description}</div>
      </div>
    </div>
  )
}

const EnvironmentSelector = ({ field, label }) => {
  const { formState, updateFormValue, errors } = useContext(FormContext)

  const updateValue = useCallback(
    (value) => updateFormValue(field, value),
    [updateFormValue, field]
  )

  const selectedEnvironment = formState[field] || 'development'
  const classNames = ['environment-select-field']
  const fieldErrors =
    errors && errors[field] && errors[field].map((error) => `${label} ${error}`)

  if (fieldErrors) classNames.push('error')

  return (
    <div className={classNames.join(' ')}>
      <label>{label}</label>
      <div>
        <EnvironmentSelectItem
          icon={<IoCodeSlashOutline />}
          value="development"
          label="Development"
          selected={selectedEnvironment === 'development'}
          description="This project is used by engineers as a working environment to test new applications and features"
          onSelect={updateValue}
        />
        <EnvironmentSelectItem
          icon={<FiSearch />}
          value="staging"
          label="Staging"
          selected={selectedEnvironment === 'staging'}
          description="The project is mainly used by your testing team and is used to test changes before releasing them to Production."
          onSelect={updateValue}
        />
        <EnvironmentSelectItem
          icon={<AiOutlineCheck />}
          value="production"
          label="Production"
          selected={selectedEnvironment === 'production'}
          description="The project supports devices in the field which are actively used by users and applications."
          onSelect={updateValue}
        />
      </div>

      <span className="validation-errors">
        {fieldErrors && fieldErrors.map((error) => <span>{error}</span>)}
      </span>
    </div>
  )
}

export default EnvironmentSelector
