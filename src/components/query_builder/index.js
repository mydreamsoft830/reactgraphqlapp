import { useEffect, useCallback, useMemo, useState } from 'react'
import Select from 'react-select'
import classNames from 'classnames'
import { useLazyQuery } from '@apollo/client'
import { GetTimeseriesFields } from 'graphql/queries'
import useMeasurementsOptions from 'hooks/use_measurements_options'
import useTagsOptions from 'hooks/use_tags_options'
import { useStateContext } from 'context/state'
import TimeseriesQueryParser from 'util/query_parser'
import './builder.scss'

const aggregationOptions = [
  { value: 'avg', label: 'Avg' },
  { value: 'sum', label: 'Sum' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' }
]

const MeasurementSelect = (props) => {
  const {
    measurement,
    setMeasurement,
    measurementOptions
  } = props

  return (
    <div>
      <Select
        className='react-select-container'
        classNamePrefix="react-select"
        value={measurement}
        onChange={setMeasurement}
        options={measurementOptions}
        placeholder="Measurement"
      />
    </div>
  )
}

const FieldsSelect = (props) => {
  const { fields, setFields, fieldOptions } = props
  return (
    <div>
      <span>
        <Select
          className='react-select-container'
          classNamePrefix="react-select"
          value={fields}
          onChange={setFields}
          options={fieldOptions}
          isMulti={true}
          placeholder="All fields"
        />
      </span>
    </div>
  )
}

const ScopeSelect = (props) => {
  const { scope, setScope, tagPairsOptions } = props
  
  const filteredOptions = useMemo(
    () =>
      tagPairsOptions.filter(({ value }) => {
        if (!scope) return true

        for (const { value: scopeValue } of scope) {
          const [tagName] = scopeValue.split(':')

          if (value.startsWith(tagName + ':')) return false
        }

        return true
      }),
    [tagPairsOptions, scope]
  )
  return (
    <div className="scope-select">
      <div className="scope-title">
        scope by
      </div>
      <div>
        <Select
          className='react-select-container'
          classNamePrefix="react-select"
          value={scope}
          onChange={setScope}
          options={filteredOptions}
          isMulti={true}
          placeholder="Everything"
        />
      </div>
    </div>
  )
}

const AggregateSelect = (props) => {
  const {
    aggregationFunction,
    setAggregationFunction
  } = props

  return (
    <div>
      <Select
        className={classNames('react-select-container_blue')}
        classNamePrefix={classNames('react-select')}
        value={aggregationFunction}
        onChange={setAggregationFunction}
        options={aggregationOptions}
        style={{ width: '100px' }}
      />
    </div>
  )
}
const AggregateFieldsSelect = (props) => {
  const {
    aggregateTags,
    setAggregateTags,
    tagsOptions,
  } = props

  return (
    <div className="agr-select">
      <div className="agr-title">
        agr by
      </div>
      <div>
        <Select
          className='react-select-container'
          classNamePrefix="react-select"
          value={aggregateTags}
          onChange={setAggregateTags}
          options={tagsOptions}
          isMulti={true}
          placeholder="Select a field"
        />
      </div>
    </div>
  )
}

const QueryBuilder = (props) => {
  const { onChange, query, isAddQuery } = props
  const { selectedProject } = useStateContext()
  const [measurement, setMeasurementRaw] = useState(null)
  const [fields, setFields] = useState(null)
  const [scope, setScope] = useState(null)
  const [aggregateTags, setAggregateTags] = useState(null)
  const [aggregationFunction, setAggregationFunction] = useState(
    aggregationOptions[0]
  )
  const { measurementOptions } = useMeasurementsOptions()

  const setMeasurement = useCallback(value => {
    setMeasurementRaw(value)
    setAggregateTags(null)
    setFields(null)
    setScope(null)
    setAggregationFunction(aggregationOptions[0])
  }, [])

  const [loadFields, { data: fieldsData }] = useLazyQuery(
    GetTimeseriesFields,
    {
      variables: {
        projectId: selectedProject.id,
        measurement: measurement ? measurement.value : null
      },
      fetchPolicy: 'network-only'
    }
  )

  const { loadTags, tagPairsOptions, tagsOptions } = useTagsOptions(
    measurement ? measurement.value : null
  )

  const fieldOptions =
    fieldsData && fieldsData.timeseriesFields
      ? fieldsData.timeseriesFields.map(({ name }) => ({
        value: name,
        label: name
      }))
      : []

  useEffect(() => {
    if (measurement === null) {
      setFields(null)
      setScope(null)
      setAggregateTags(null)
    } else {
      loadFields()
      loadTags()
    }
  }, [measurement, setFields, setScope, setAggregateTags, loadFields, loadTags])

  useEffect(() => {
    let str = ''
    if (aggregationFunction) {
      str += aggregationFunction.value + ':'
    }
    if (measurement) {
      str += measurement.value
    }
    if (fields && fields.length > 0) {
      str += '('
      let i
      for (i = 0; i < fields.length - 1; i++) {
        str += fields[i].value + ','
      }
      str += fields[fields.length - 1].value + ')'
    }
    if (scope && scope.length > 0) {
      str += '{'
      let i
      for (i = 0; i < scope.length - 1; i++) {
        str += scope[i].value + ','
      }
      str += scope[scope.length - 1].value + '}'
    } else {
      str += '{}';
    }
    if (aggregateTags && aggregateTags.length > 0) {
      str += ' by {'
      let i
      for (i = 0; i < aggregateTags.length - 1; i++) {
        str += aggregateTags[i].value + ','
      }
      str += aggregateTags[aggregateTags.length - 1].value + '}'
    }
    onChange(str)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurement, fields, scope, aggregateTags, aggregationFunction])

  useEffect(() => {
    if (!isAddQuery) {
      let newParsedQuery = TimeseriesQueryParser.parse(query)
      setAggregationFunction({ label: newParsedQuery.aggregateMethod, value: newParsedQuery.aggregateMethod })
      setMeasurement({ label: newParsedQuery.measurement, value: newParsedQuery.measurement })
      let newFields = newParsedQuery.fields;
      let fieldArray = [];
      if (newFields.length > 0) {
        for (let i = 0; i < newFields.length; i++) {
          fieldArray.push({ label: newFields[i], value: newFields[i] })
        }
        setFields(fieldArray)
      }
      let newScopes = newParsedQuery.scope;
      let scopeArray = [];
      if (newScopes.length > 0) {
        for (let i = 0; i < newScopes.length; i++) {
          scopeArray.push({ label: newScopes[i].name + '=' + newScopes[i].value, value: newScopes[i].name + ':' + newScopes[i].value })
        }
        setScope(scopeArray)
      }
      let newAggregationGroups = newParsedQuery.aggregationGroups;
      let aggregationGroupArray = [];
      if (newAggregationGroups.length > 0) {
        for (let i = 0; i < newAggregationGroups.length; i++) {
          aggregationGroupArray.push({ label: newAggregationGroups[i], value: newAggregationGroups[i] })
        }
        setAggregateTags(aggregationGroupArray)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddQuery])

  return (
    <div className="builder-container">
      <div className="builder-topbar">
        <div className="measurement-group">
          <AggregateSelect
            aggregationFunction={aggregationFunction}
            setAggregationFunction={setAggregationFunction}
          />
          <MeasurementSelect
            measurement={measurement}
            setMeasurement={setMeasurement}
            measurementOptions={measurementOptions}
          />
          <FieldsSelect
            fields={fields}
            setFields={setFields}
            fieldOptions={fieldOptions}
          />
        </div>
        <div className="sort-option-group">
          <ScopeSelect
            scope={scope}
            setScope={setScope}
            tagPairsOptions={tagPairsOptions}
          />
          <AggregateFieldsSelect
            aggregateTags={aggregateTags}
            setAggregateTags={setAggregateTags}
            tagsOptions={tagsOptions}
          />
        </div>
      </div>
    </div>
  )
}

export default QueryBuilder
