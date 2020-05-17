import { useContext } from 'react'
import { FormContext } from './form'

const TextField = ({
  field,
  label,
  placeholder = '',
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
        <input
          name={field}
          type="text"
          value={formState[field] || ''}
          onChange={updateFormField}
          autoComplete="off"
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <span className="validation-errors">
        {fieldErrors &&
          fieldErrors.map((error, i) => <span key={i}>{error}</span>)}
      </span>

      {description && <span className="description">{description}</span>}
    </div>
  )
}

export default TextField
