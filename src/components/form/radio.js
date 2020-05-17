import { useContext } from 'react'
import { FormContext } from './form'

const Radio = ({
  field,
  label,
  options,
  placeholder = '',
  required = false,
  description = null
}) => {
  const { formState, updateFormField, errors } = useContext(FormContext)

  const classNames = ['radio']
  const fieldErrors =
    errors && errors[field] && errors[field].map((error) => `${label} ${error}`)

  if (fieldErrors) classNames.push('error')
  if (required) classNames.push('required')

  const fieldValue = formState[field] || ''

  return (
    <div className={classNames.join(' ')}>
      {label && <label>{label}</label>}
      <div>
        {options.map(({ name, value }, i) => {
          return (
            <span>
              <input
                type="radio"
                value={value}
                name={field}
                checked={fieldValue === value}
                onChange={updateFormField}
              />
              <label>{name}</label>
            </span>
          )
        })}
      </div>

      <span className="validation-errors">
        {fieldErrors &&
          fieldErrors.map((error, i) => <span key={i}>{error}</span>)}
      </span>

      {description && <span className="description">{description}</span>}
    </div>
  )
}

export default Radio
