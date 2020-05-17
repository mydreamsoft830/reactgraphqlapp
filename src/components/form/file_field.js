import { useCallback, useContext } from 'react'
import { FormContext } from './form'

const FileField = ({ field, label, required = false, description = null }) => {
  const { updateFormValue, errors } = useContext(FormContext)

  const onChange = useCallback(
    (e) => {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.readAsBinaryString(file)
      reader.onloadend = () => {
        updateFormValue(field, reader.result)
      }
    },
    [field, updateFormValue]
  )

  const classNames = ['file-field']
  const fieldErrors =
    errors && errors[field] && errors[field].map((error) => `${label} ${error}`)

  if (fieldErrors) classNames.push('error')
  if (required) classNames.push('required')

  return (
    <div className={classNames.join(' ')}>
      <label>{label}</label>
      <div>
        <input name={field} type="file" onChange={onChange} />
      </div>

      <span className="validation-errors">
        {fieldErrors &&
          fieldErrors.map((error, i) => <span key={i}>{error}</span>)}
      </span>

      {description && <span className="description">{description}</span>}
    </div>
  )
}

export default FileField
