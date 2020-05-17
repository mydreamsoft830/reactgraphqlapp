import { useState, useMemo, useCallback } from 'react'
import Select from 'react-select'
import { ExploreContextProvider, useExploreContext } from './explore_context'
import { useFullWidthContentStyle } from 'context/style'
import { ExploreResults } from './results'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { FiRefreshCcw } from 'react-icons/fi'
import { Export } from './export'
import Error from 'components/error'

import './explore.scss'
import { LoadingFullFrame } from 'components/loading'
import Button from 'components/button'
import mixpanel from 'mixpanel-browser'

const aggregationOptions = [
  { value: -1, label: 'Auto' },
  { value: 0, label: 'None' },
  { value: 60 * 1000, label: '1 minute' },
  { value: 300 * 1000, label: '5 minutes' },
  { value: 900 * 1000, label: '15 minutes' },
  { value: 3600 * 1000, label: '1 hour' },
  { value: 21600 * 1000, label: '6 hours' },
  { value: 86400 * 1000, label: '1 day' }
]

const MeasurementSelect = () => {
  const {
    measurement,
    setMeasurement,
    measurementOptions
  } = useExploreContext()

  return (
    <div>
      <span>Measurement</span>
      <span>
        <Select
          className='react-select-container'
          classNamePrefix="react-select"
          value={measurement}
          onChange={setMeasurement}
          options={measurementOptions}
          placeholder="Select a measurement"
        />
      </span>
    </div>
  )
}

const FieldsSelect = () => {
  const { fields, setFields, fieldOptions } = useExploreContext()

  return (
    <div>
      <span>Fields</span>
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

const ScopeSelect = () => {
  const { scope, setScope, tagPairsOptions } = useExploreContext()

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
    <div>
      <span>Scope by</span>
      <span>
        <Select
          className='react-select-container'
          classNamePrefix="react-select"
          value={scope}
          onChange={setScope}
          options={filteredOptions}
          isMulti={true}
          placeholder="Everything"
        />
      </span>
    </div>
  )
}

const AggregateSelect = () => {
  const {
    aggregateTags,
    setAggregateTags,
    tagsOptions,
    aggregationOptions,
    aggregationFunction,
    setAggregationFunction
  } = useExploreContext()

  return (
    <div>
      <span>Aggregate by</span>
      <span className="aggregate-select">
        <div>
          <Select
            className='react-select-container'
            classNamePrefix="react-select"
            value={aggregationFunction}
            onChange={setAggregationFunction}
            options={aggregationOptions}
            style={{ width: '100px' }}
          />
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
      </span>
    </div>
  )
}

const AdvancedOptions = () => {
  const { rollupInterval, setRollupInterval } = useExploreContext()
  const [open, setOpen] = useState(false)

  return (
    <div className={'advanced-options' + (open ? ' open' : '')}>
      <div
        onClick={() => setOpen(!open)}
        className={'advanced-options-header' + (open ? ' open' : '')}
      >
        <AiOutlineCaretRight />
        Advanced options
      </div>

      {open && (
        <div className="controls">
          <div className="control">
            <span>Aggregation period</span>
            <span>
              <select
                name={'aggregation-period'}
                value={rollupInterval}
                onChange={(e) => setRollupInterval(parseInt(e.target.value))}
              >
                {aggregationOptions.map((option, i) => (
                  <option key={i} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const RefreshButton = () => {
  const { queryRefresh } = useExploreContext()

  const doRefresh = useCallback(() => {
    queryRefresh()

    mixpanel.track('Refresh Explore')
  }, [queryRefresh])

  return (
    <Button onClick={doRefresh} className="refresh-button">
      <FiRefreshCcw size={14} />
    </Button>
  )
}

const ExploreSidebar = () => {
  useFullWidthContentStyle()

  return (
    <div className="explore-sidebar">
      <h1>Explore</h1>

      <MeasurementSelect />
      <FieldsSelect />
      <ScopeSelect />
      <AggregateSelect />
      <AdvancedOptions />

      <div className="controls">
        <RefreshButton />
        <Export />
      </div>
    </div>
  )
}

const ExploreDataContainer = () => {
  const { error, measurementLoading } = useExploreContext()

  if (error) return <Error error={error} />
  if (measurementLoading) return <LoadingFullFrame />

  return (
    <div className="explore-container">
      <ExploreSidebar />
      <ExploreResults />
    </div>
  )
}

const ExploreData = () => {
  return (
    <ExploreContextProvider>
      <ExploreDataContainer />
    </ExploreContextProvider>
  )
}

export default ExploreData
