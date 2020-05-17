import { useContext } from 'react'
import { FormContext } from './form'

const SelectField = ({
  field,
  label,
  options = [],
  required = false,
  description = null,
  disabled = false
}) => {
  const { formState, updateFormField, errors } = useContext(FormContext)

  const classNames = ['text-field']
  const fieldErrors =
    errors && errors[field] && errors[field].map((error) => `${label} ${error}`)

  if (fieldErrors) classNames.push('error')
  if (required) classNames.push('required')
  if (disabled) classNames.push('disabled')

  return (
    <div className={classNames.join(' ')}>
      {label && <label>{label}</label>}
      <div>
        <select
          name={field}
          value={formState[field] || ''}
          onChange={updateFormField}
          disabled={disabled}
        >
          {options.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <span className="validation-errors">
        {fieldErrors &&
          fieldErrors.map((error, i) => <span key={i}>{error}</span>)}
      </span>

      {description && <span className="description">{description}</span>}
    </div>
  )
}

export default SelectField
