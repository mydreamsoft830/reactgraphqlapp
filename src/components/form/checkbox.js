import { useCallback, useContext } from 'react'
import { FormContext } from './form'

import './checkbox.scss'
const CheckBox = ({
    field,
    label,
    placeholder = '',
    required = false,
    description = null
}) => {
    const { formState, updateFormValue, errors } = useContext(FormContext)

    const classNames = ['checkbox']
    const fieldErrors =
        errors && errors[field] && errors[field].map((error) => `${label} ${error}`)

    if (fieldErrors) classNames.push('error')
    if (required) classNames.push('required')

    const fieldValue = formState[field] || false
    const toggleCheckbox = useCallback(() => {
        updateFormValue(field, !fieldValue)
    }, [field, fieldValue, updateFormValue])
    return (
        <div className={classNames.join(' ')} onClick={toggleCheckbox}>
            <span className='check_field'>
                <input
                    type="checkbox"
                    name={field}
                    value={formState[field]}
                    checked={formState[field] || false}
                    readOnly
                />
                <label>{label}</label>
            </span>

            <span className="validation-errors">
                {fieldErrors &&
                    fieldErrors.map((error, i) => <span key={i}>{error}</span>)}
            </span>

            {description && <span className="description">{description}</span>}
        </div>
    )
}

export default CheckBox
