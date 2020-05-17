import {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect
} from 'react'

import './form.scss'

export const FormContext = createContext({})

const formReducer = (state, { field, value }) => {
  const stateUpdate = { [field]: value }
  return Object.assign({}, state, stateUpdate)
}

const Form = ({
  children,
  initialState,
  onSubmit,
  errors,
  loading,
  onChange = () => { }
}) => {
  const [formState, formDispatch] = useReducer(formReducer, initialState)
  const updateFormField = useCallback(
    (e) => {
      formDispatch({ field: e.target.name, value: e.target.value })
    },
    [formDispatch]
  )

  const updateFormValue = useCallback(
    (field, value) => {
      formDispatch({ field, value })
    },
    [formDispatch]
  )

  const submitForm = useCallback(async () => {
    if (!onSubmit) return false

    try {
      return await onSubmit(formState, { updateFormValue })
    } catch (e) {
      return false
    }
  }, [onSubmit, formState, updateFormValue])

  useEffect(() => {
    onChange(formState)
  }, [onChange, formState])

  return (
    <FormContext.Provider
      value={{
        formState,
        updateFormField,
        updateFormValue,
        submitForm,
        errors,
        loading
      }}
    >
      <div className="form">{children}</div>
    </FormContext.Provider>
  )
}

export const useForm = () => useContext(FormContext)

export default Form
