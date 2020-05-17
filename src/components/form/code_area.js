import { useContext } from 'react'
import { FormContext } from './form'
import CodeEditor from '@uiw/react-textarea-code-editor'

import './code-area.scss'

const CodeArea = ({
  field,
  label,
  placeholder = '',
  minHeight = 16,
  required = false,
  description = null,
  language = 'JSON'
}) => {
  const { formState, updateFormValue, errors } = useContext(FormContext)

  const classNames = ['code-area']
  const fieldErrors =
    errors && errors[field] && errors[field].map(error => `${label} ${error}`)

  if (fieldErrors) classNames.push('error')
  if (required) classNames.push('required')

  return (
    <div className={classNames.join(' ')}>
      {label && <label>{label}</label>}
      <div>
        <CodeEditor
          value={formState[field] || ''}
          language={language}
          placeholder={placeholder}
          onChange={evn => updateFormValue(field, evn.target.value)}
          padding={15}
          style={{
            fontSize: 12,
            minHeight: minHeight,
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
          }}
        />
      </div>

      <span className='validation-errors'>
        {fieldErrors &&
          fieldErrors.map((error, i) => <span key={i}>{error}</span>)}
      </span>

      {description && <span className='description'>{description}</span>}
    </div>
  )
}

export default CodeArea
