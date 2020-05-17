import { SubmitButton, TextField, SelectField } from 'components/form'
import Button, { OutlineButton } from 'components/button'
import { useModal } from 'context/modal'
import { useMultistep } from 'components/multistep'
import { useCallback, useState, useEffect } from 'react'
import { BsPlusCircle } from 'react-icons/bs'
import CheckBox from 'components/form/checkbox'
import QueryBuilder from 'components/query_builder'
import { useForm } from 'components/form/form'

const TextFieldItem = (field = "graphQuery", placeholder = "My New Query") => <TextField
  key={field}
  field={field}
  placeholder={placeholder}
/>
const graphTypeOptions = [
  { label: 'Line Graph', value: 'line' },
  { label: 'Bar Graph', value: 'bar' }
]

const Step1 = (props) => {
  const { widgetType } = props
  const { setCurrentStep } = useMultistep()
  const { closeModal } = useModal()
  const [queries, setQueries] = useState([])
  const [isAddQuery, setIsAddQuery] = useState(false)
  const { updateFormValue } = useForm()

  const goBack = useCallback(() => setCurrentStep(0), [setCurrentStep])
  const onClickAddQuery = () => {
    setQueries([...queries, ''])
    setIsAddQuery(true);
  }

  useEffect(() => {
    if (updateFormValue) {
      for (let i = 0; i < queries.length; i++) {
        updateFormValue(`graphQuery${i + 1}`, queries[i]);
      }
    }
  }, [queries, updateFormValue])
  return (
    <div className="add-widget-container">
      <h1 className='title'> {`Add ${widgetType?.label}`}</h1>

      <div className="step-container">
        <div className='text-field-container'>
          <span className='label'>Widget Title</span>
          {
            TextFieldItem('displayName', 'Widget Title')
          }
          {
            widgetType?.value === "GRAPH" &&
            <SelectField
              field='graphType'
              label="Widget Type"
              options={graphTypeOptions}
              placeholder="Widget Type"
            />
          }
          {
            widgetType?.value === "VALUE" && <CheckBox
              label="Show Graph in Background"
              field="toggleGraph"
              value={false}
            />
          }
          <span className='label'>Widget Query</span>
          {
            queries.map((query, index) =>
              <QueryBuilder query={queries[index]} isAddQuery={isAddQuery} onChange={(newQuery) => {
                setQueries([...queries.slice(0, index), newQuery, ...queries.slice(index + 1)])
              }} key={index} />)
          }
          {
            widgetType?.value === "GRAPH" && <div>
              <Button onClick={() => onClickAddQuery()}>
                <BsPlusCircle />
                <span>
                  Add another query
                </span>
              </Button>
            </div>
          }
          {
            widgetType?.value === "VALUE" && queries.length === 0 ?
              <div>
                <Button onClick={() => onClickAddQuery()}>
                  <BsPlusCircle />
                  <span>
                    Add another query
                  </span>
                </Button>
              </div>
              : <></>
          }
          {
            widgetType?.value === "GAUGE" && queries.length === 0 ?
              <div>
                <Button onClick={() => onClickAddQuery()}>
                  <BsPlusCircle />
                  <span>
                    Add another query
                  </span>
                </Button>
              </div>
              : <></>
          }
        </div>
        <div className="button-footer">
          <OutlineButton onClick={goBack}>Back</OutlineButton>
          <SubmitButton label='Add Widget' onSuccess={closeModal} />
        </div>
      </div>
    </div>
  )
}

export default Step1
