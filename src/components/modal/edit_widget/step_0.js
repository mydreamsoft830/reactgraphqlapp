import { SubmitButton, TextField, SelectField } from 'components/form'
import Button from 'components/button'
import { useModal } from 'context/modal'
import { useEffect, useState } from 'react'
import { BsPlusCircle } from 'react-icons/bs'
import CheckBox from 'components/form/checkbox'
import { useForm } from 'components/form/form'
import QueryBuilder from 'components/query_builder'


const TextFieldItem = (field = "graphQuery", placeholder = "My New Query") => <TextField
  key={field}
  field={field}
  placeholder={placeholder}
/>

const graphTypeOptions = [
  { label: 'Line Graph', value: 'line' },
  { label: 'Bar Graph', value: 'bar' }
]

const Step0 = (props) => {
  const { widgetInfo } = props
  const { closeModal } = useModal()
  const { updateFormValue } = useForm()
  const [queries, setQueries] = useState([])
  const [isAddQuery, setIsAddQuery] = useState(false)
  useEffect(() => {
    setQueries([...widgetInfo.configuration?.query])
  }, [widgetInfo, updateFormValue])
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
      <h1 className='title'>Edit Widget</h1>

      <div className="step-container">
        <div className='text-field-container'>
          <span className='label'>Widget Title</span>
          {
            TextFieldItem('displayName', 'Widget Title')
          }
          {
            widgetInfo?.type === "GRAPH" &&
            <SelectField
              field='graphType'
              label="Widget Type"
              options={graphTypeOptions}
              placeholder="Widget Type"
            />
          }
          {
            widgetInfo?.type === "VALUE" && <CheckBox
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
            widgetInfo?.type === "GRAPH" && <div>
              <Button onClick={() => onClickAddQuery()}>
                <BsPlusCircle />
                <span>
                  Add another query
                </span>
              </Button>
            </div>
          }
        </div>
        <div className="button-footer">
          <SubmitButton label='Save Widget' onSuccess={closeModal} />
        </div>
      </div>
    </div>
  )
}

export default Step0
