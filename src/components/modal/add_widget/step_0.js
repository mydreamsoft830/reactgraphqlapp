import { useCallback, useEffect, useState } from 'react'
import Select from 'react-select'
import { useMultistep } from 'components/multistep'
import { useLocalStateContext } from 'context/local_state'

const fieldOptions = [
  { label: 'Graph Widget', value: 'GRAPH' },
  { label: 'Value Widget', value: 'VALUE' },
  { label: 'Gauge Widget', value: 'GAUGE' }
]

const Step0 = (props) => {
  const { widgetInfo } = props
  const { setCurrentStep } = useMultistep()
  const { setLocalValue } = useLocalStateContext()
  const [field] = useState(widgetInfo?.type || '')
  const onNextStep = useCallback((field) => {
    setLocalValue('widgetType', field);
    setCurrentStep(1)
  }, [setCurrentStep, setLocalValue])

  useEffect(() => {
    field === 'GRAPH' && onNextStep(fieldOptions[0])
    field === 'VALUE' && onNextStep(fieldOptions[1])
  }, [field, onNextStep])

  return (
    <div className="add-widget-container">
      <h1 className='title'>{widgetInfo ? `Edit ${widgetInfo.type.toLowerCase()} Widget` : 'Add New Widget'}</h1>

      <div className="step-container">
        <div className='text-field-container'>
          <span className='label'>Select Widget Type</span>
          <Select
            value={field}
            onChange={onNextStep}
            options={fieldOptions}
            placeholder="Widget Type"
          />
        </div>
      </div>
    </div>
  )
}

export default Step0
