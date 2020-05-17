import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { useStateContext } from 'context/state'
import { MdOutlineImportantDevices } from 'react-icons/md'
import { useQuery, useMutation } from '@apollo/client'
import { GetTimeseriesMeasurements, GetTimeseriesFields } from 'graphql/queries'
import { UpdateTimeseriesFieldMetadata, UpdateTimeseriesMeasurementMetadata } from 'graphql/mutations'
import { Form, SubmitButton, CodeArea } from 'components/form'
import Button from 'components/button'
import { FormContext } from 'components/form/form'
import { FieldUnitPrefixType, FieldUnitType } from 'util/units'
import CallToAction, {
  CallToActionHeader,
  CallToActionDescription,
  CallToActionImage
} from 'components/call_to_action'
import { toast } from 'react-toastify'

import { SummaryResultsTable } from './results_table'
import './summary.scss'



const SummaryData = () => {

  const { selectedProject } = useStateContext()


  const [measurementList, setMeasurementList] = useState([])
  const [selectedMeasurement, setSelectedMeasurement] = useState(0)

  const onClickMeasurement = (index) => {
    setSelectedMeasurement(index)
  }

  const { loading, error, data, refetch } = useQuery(GetTimeseriesMeasurements, {
    variables: {
      projectId: selectedProject.id,
    },
    refetchQueries: [GetTimeseriesMeasurements]
  })

  useEffect(() => {
    if (!error && data) {
      setMeasurementList(data.timeseriesMeasurements)
      refetch()
      if (selectedMeasurement >= data.timeseriesMeasurements.length) {
        setSelectedMeasurement(0)
      }
    } else {
      setMeasurementList([])
    }
  }, [loading, error, data, refetch, selectedMeasurement])

  return (
      <div className="summary-container">
        <div className="summary-topbar">
          <h1>Metadata</h1>
          <span>View and edit the metadata for your stored time series data</span>
        </div>
        {
          measurementList.length > 0 ?
            <div className="summary-body">
              <div className="summary-sidebar">
                <ul className="list">
                  {measurementList.length > 0 &&
                    measurementList.map((measurement, index) => (
                      <li
                        className={index === selectedMeasurement ? 'active' : ''}
                        key={index}
                        onClick={() => onClickMeasurement(index)}
                      >
                        {measurement.name}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="horizontal" />
              <Form initialState={{ desiredState: '' }} >
                <EditMetadata measurement={measurementList[selectedMeasurement]} refetchMeasurements={refetch} />
              </Form>
            </div>
            :
            <>
              <CallToAction>
                <CallToActionImage>
                  <MdOutlineImportantDevices />
                </CallToActionImage>
                <CallToActionHeader>
                  You don't have any measurements yet.
                </CallToActionHeader>
                <CallToActionDescription>
                  All of the measurements in your project can be managed here.
                </CallToActionDescription>
              </CallToAction>
            </>
        }
      </div>
  )
}

const EditMetadata = ({ measurement, refetchMeasurements }) => {
  const { formState, updateFormValue } = useContext(FormContext)
  const { selectedProject } = useStateContext()
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(0)
  const [metadataList, setMetadataList] = useState([])
  const [isEdit, setIsEdit] = useState(true)
  const [metaDescription, setMetaDescription] = useState('');
  const [updateTimeseriesFieldMetadata] = useMutation(UpdateTimeseriesFieldMetadata)
  const [updateTimeseriesMeasurementMetadata] = useMutation(UpdateTimeseriesMeasurementMetadata)

  const { loading, error, data, refetch } = useQuery(GetTimeseriesFields, {
    variables: {
      projectId: selectedProject.id,
      measurement: measurement.name,
    },
    refetchQueries: [GetTimeseriesFields]
  })
  useEffect(() => {
    if (!error && data) {
      let fieldsNames = data.timeseriesFields.map((item, idx) => item.name)
      let mdataList = data.timeseriesFields.map((item, idx) => item.metadata)
      setFields(fieldsNames)
      setMetadataList(mdataList)
      refetch()
      if (selectedField >= data.timeseriesFields.length) {
        setSelectedField(0)
      }
    } else {
      setFields([])
    }
  }, [loading, error, data, refetch, selectedField])

  useEffect(() => {
    if (measurement) {
      setMetaDescription(measurement.metadata.description ? measurement.metadata.description : '')
    } else {
      setMetaDescription('')
    }
  }, [measurement])

  useEffect(() => {
    if (updateFormValue && measurement) {
      updateFormValue('measurementMetadata', measurement.metadata.description && measurement.metadata.description !== '' ? measurement.metadata.description : '')
    }
  }, [updateFormValue, measurement, metaDescription])


  const onClickField = (index) => {
    setSelectedField(index)
  }
  const onSubmit = async (params) => {
    try {
      await updateTimeseriesFieldMetadata({
        variables: {
          projectId: selectedProject.id,
          measurement: measurement.name,
          field: fields[selectedField],
          metadata: {
            'description': params.fieldMetadata,
            'basePrefix': params.prefixUnit,
            'unit': params.mainUnit,
            'perUnit': params.perUnit,
          },
        },
      })
      toast.success('Successfully updated the measurement metadata')
      refetch()
    } catch (e) {
      console.log("error:", e)
    }
  }

  const onClickEditSave = async (flag) => {
    if (!isEdit) {
      try {
        await updateTimeseriesMeasurementMetadata({
          variables: {
            projectId: selectedProject.id,
            measurement: measurement.name,
            metadata: {
              'description': formState.measurementMetadata,
            },
            refetchQueries: [GetTimeseriesMeasurements]
          },
        })
        toast.success('Successfully updated the measurement metadata')
        refetchMeasurements()
      } catch (e) {
        console.log("error:", e)
      }
    }
    setIsEdit(flag);
  }

  return (
    <React.Fragment>
      {measurement ?
        <div className="summary-metadata">
          <div className="metadata-description">
            <div className="description-title">
              {measurement.name}
            </div>
            <div className="description-content">
              {/* This is an example description that user will set that describes what data is stored in this environment */}
              {isEdit ?
                metaDescription
                :
                <CodeArea
                  field="measurementMetadata"
                  label=""
                  placeholder="This is a description of this field that you can edit"
                  minHeight={100}
                  required={true}
                />
              }
            </div>
          </div>
          <div className="edit-btn" onClick={() => onClickEditSave(!isEdit)}>
            {isEdit ?
              <Button>Edit</Button>
              :
              <Button>Save</Button>
            }
          </div>
          <div className="title">
            Tags
          </div>
          <div className="summary-table">
            <SummaryResultsTable measurement={measurement} />
          </div>
          <div className="metadata-container">
            <div className="metadata-field">
              <div className="title">
                Fields
              </div>
              <div className="field-body">
                <ul className="list">
                  {fields.length > 0 &&
                    fields.map((field, index) => (
                      <li
                        className={index === selectedField ? 'active' : ''}
                        key={index}
                        onClick={() => onClickField(index)}
                      >
                        {field}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <Form initialState={{ fieldMetadata: '' }} onSubmit={onSubmit}>
              <EditMetadataContent field={fields[selectedField]} metadata={metadataList[selectedField]} />
            </Form>
          </div>
        </div>
        :
        <>
        </>
      }
    </React.Fragment>
  )
}

const UnitsSelect = (props) => {
  const { unitOptions, unit, setUnit } = props
  return (
    <div>
      <span>
        <Select
          value={unit}
          onChange={setUnit}
          className='react-select-container'
          classNamePrefix="react-select"
          options={unitOptions}
          isMulti={false}
          placeholder="All units"
        />
      </span>
    </div>
  )
}
const EditMetadataContent = ({ field, metadata }) => {
  const { updateFormValue } = useContext(FormContext)
  const [prefixUnit, setPrefixUnit] = useState();
  const [mainUnit, setMainfixUnit] = useState();
  const [perUnit, setPerUnit] = useState();

  useEffect(() => {
    if (metadata) {
      setPrefixUnit({ value: metadata.basePrefix, label: metadata.basePrefix.charAt(0).toUpperCase() + metadata.basePrefix.slice(1).toLowerCase() })
      setMainfixUnit({ value: metadata.unit, label: metadata.unit.charAt(0).toUpperCase() + metadata.unit.slice(1).toLowerCase() })
      setPerUnit({ value: metadata.perUnit, label: metadata.perUnit.charAt(0).toUpperCase() + metadata.perUnit.slice(1).toLowerCase() })
    }
  }, [field, metadata])

  useEffect(() => {
    if (updateFormValue && field) {
      updateFormValue('prefixUnit', prefixUnit ? prefixUnit.value : '')
      updateFormValue('mainUnit', mainUnit ? mainUnit.value : '')
      updateFormValue('perUnit', perUnit ? perUnit.value : '')
    }
  }, [updateFormValue, field, prefixUnit, mainUnit, perUnit])

  useEffect(() => {
    if (updateFormValue && field && metadata) {
      updateFormValue('fieldMetadata', metadata.description ? metadata.description : '')
    }
  }, [updateFormValue, field, metadata])

  return (
    <React.Fragment>
      {field ?
        <div className="metadata-body">
          <div className="title">
            Field Metadata
          </div>
          <div className="metadata-content">
            <CodeArea
              field="fieldMetadata"
              label=""
              placeholder="This is a description of this field that you can edit"
              minHeight={100}
              required={true}
            />
          </div>
          <div className="title">
            Units
          </div>
          <div className="metadata-units">
            <UnitsSelect unitOptions={FieldUnitPrefixType} unit={prefixUnit} setUnit={setPrefixUnit} />
            <UnitsSelect unitOptions={FieldUnitType} unit={mainUnit} setUnit={setMainfixUnit} />
            <div className="slash">
              per
            </div>
            <UnitsSelect unitOptions={FieldUnitType} unit={perUnit} setUnit={setPerUnit} />
          </div>
          <div className="action">
            <SubmitButton label="Save Field Metadata"></SubmitButton>
            <div className="remove-btn">
            </div>
          </div>
        </div>
        :
        <>
        </>
      }
    </React.Fragment>
  )
}


export default SummaryData
