import { useContext } from 'react'
import { FormContext } from './form'

const TextArea = ({
  field,
  label,
  placeholder = '',
  required = false,
  description = null,
  rows = 4,
  cols = 50
}) => {
  const { formState, updateFormField, errors } = useContext(FormContext)

  const classNames = ['text-area']
  const fieldErrors =
    errors && errors[field] && errors[field].map((error) => `${label} ${error}`)

  if (fieldErrors) classNames.push('error')
  if (required) classNames.push('required')

  return (
    <div className={classNames.join(' ')}>
      {label && <label>{label}</label>}
      <div>
        <textarea
          name={field}
          value={formState[field] || ''}
          onChange={updateFormField}
          placeholder={placeholder}
          rows={rows}
          cols={cols}
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

export default TextArea
