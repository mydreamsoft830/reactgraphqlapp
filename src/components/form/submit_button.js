import { useCallback, useContext } from 'react'
import { FormContext } from './form'
import { LoadingSmall } from 'components/loading'

const SubmitButton = ({
  label = 'Save',
  onSuccess = () => {},
  disabled = false
}) => {
  const { submitForm, loading } = useContext(FormContext)
  const classNames = ['button', 'form-submit-button']

  if (loading) classNames.push('loading')
  if (disabled) classNames.push('disabled')

  const onClickHandler = useCallback(async () => {
    if (loading) return

    if (await submitForm()) onSuccess()
  }, [loading, submitForm, onSuccess])

  return (
    <button
      type="button"
      onClick={onClickHandler}
      className={classNames.join(' ')}
    >
      {!loading ? label : <LoadingSmall />}
    </button>
  )
}

export default SubmitButton
