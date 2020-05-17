import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react'
import { GetTimeseriesFields, GetTimeseriesQueryData } from 'graphql/queries'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useStateContext } from 'context/state'
import useMeasurementsOptions from 'hooks/use_measurements_options'
import useTagsOptions from 'hooks/use_tags_options'
import mixpanel from 'mixpanel-browser'
import { timeOptions, timeValueToMs, roundTo5mins } from 'util/timeseries'


const aggregationOptions = [
  { value: 'avg', label: 'Avg' },
  { value: 'sum', label: 'Sum' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' }
]

export const ExploreContext = createContext({})

export const ExploreContextProvider = props => {
  const { children } = props
  const { selectedProject } = useStateContext()

  const [error, setError] = useState(null)
  const [measurement, setMeasurementRaw] = useState(null)
  const [fields, setFields] = useState(null)
  const [scope, setScope] = useState(null)
  const [aggregateTags, setAggregateTags] = useState(null)
  const [timePeriod, setTimePeriod] = useState(timeOptions[0])
  const [aggregationFunction, setAggregationFunction] = useState(
    aggregationOptions[0]
  )
  const [timeOffset, setTimeOffset] = useState(0)
  const [resultsDisplayType, setResultsDisplayType] = useState('graph')
  const [rollupInterval, setRollupInterval] = useState(-1)
  const [fieldData, setFieldData] = useState('');
  const [queryVariables, setQueryVariables] = useState({
    projectId: selectedProject.id,
    query: '',
    startTime: Date.now(),
    endTime: Date.now(),
    rollupInterval:
      rollupInterval !== -1 ? rollupInterval : timePeriod.rollupInterval
  })

  useEffect(() => {
    if (!queryVariables.query) return

    mixpanel.track('Explore query', {
      projectId: queryVariables.projectId,
      query: queryVariables.query,
      startTime: queryVariables.startTime,
      endTime: queryVariables.endTime,
      rollupInterval: queryVariables.rollupInterval
    })
  }, [queryVariables])


  const {
    measurementOptions,
    error: measurementError,
    loading: measurementLoading
  } = useMeasurementsOptions()

  const { loadTags, tagPairsOptions, tagsOptions } = useTagsOptions(
    measurement ? measurement.value : null
  )

  const [loadFields, { data: fieldsData, error: fieldsError }] = useLazyQuery(
    GetTimeseriesFields,
    {
      variables: {
        projectId: selectedProject.id,
        measurement: measurement ? measurement.value : null
      },
      fetchPolicy: 'network-only'
    }
  )
  useEffect(() => {
    if(fieldsData){
      setFieldData(fieldsData);
    }
  },[fieldsData])
  const {
    data: queryDataResults,
    error: queryError,
    loading: queryLoading,
    refetch: refetchTimeseries
  } = useQuery(GetTimeseriesQueryData, {
    variables: queryVariables,
    skip: queryVariables.query.length === 0,
    notifyOnNetworkStatusChange: true
  })

  const calcQueryVariablesTimes = useCallback((timePeriod, timeOffset) => {
    const timeDelta = timeValueToMs(timePeriod)

    return {
      startTime: roundTo5mins(Date.now() - timeDelta + timeOffset, 'down'),
      endTime: roundTo5mins(Date.now() + timeOffset, 'up')
    }
  }, [])

  const queryRefresh = useCallback(() => {
    setQueryVariables(vars => {
      return Object.assign(
        {},
        vars,
        calcQueryVariablesTimes(timePeriod, timeOffset)
      )
    })
    refetchTimeseries()
  }, [refetchTimeseries, timePeriod, timeOffset, calcQueryVariablesTimes])

  // Refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setQueryVariables(vars => {
        return Object.assign(
          {},
          vars,
          calcQueryVariablesTimes(timePeriod, timeOffset)
        )
      })
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [calcQueryVariablesTimes, timePeriod, timeOffset])

  const queryData =
    queryDataResults && queryDataResults.timeseriesQuery
      ? queryDataResults.timeseriesQuery
      : null

  const fieldOptions =
    fieldsData && fieldsData.timeseriesFields
      ? fieldsData.timeseriesFields.map(({ name }) => ({
        value: name,
        label: name
      }))
      : []

  // Global error handling

  useEffect(() => {
    if (measurementError) setError(measurementError)
    if (fieldsError) setError(fieldsError)
    if (queryError) setError(queryError)
  }, [setError, measurementError, fieldsError, queryError])

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
    setQueryVariables(vars => {
      return Object.assign(
        {},
        vars,
        {
          rollupInterval:
            rollupInterval !== -1 ? rollupInterval : timePeriod.rollupInterval
        },
        calcQueryVariablesTimes(timePeriod, timeOffset)
      )
    })
  }, [timePeriod, timeOffset, rollupInterval, calcQueryVariablesTimes])

  useEffect(() => {
    setTimeOffset(0)
  }, [timePeriod])

  useEffect(() => {
    if (!measurement) {
      setQueryVariables(vars =>
        Object.assign(
          {},
          vars,
          { query: '' },
          calcQueryVariablesTimes(timePeriod, timeOffset)
        )
      )
      return
    }


    const fieldsStr = (fields && fields.length > 0 ? fields : [])
      .map(field => field.value)
      .join(',')

    const scopeStr =
      scope && scope.length > 0 ? scope.map(tag => tag.value).join(',') : ''

    let queryString = `${aggregationFunction.value}:${measurement.value}(${fieldsStr}){${scopeStr}}`

    if (aggregateTags && aggregateTags.length > 0) {
      const agggregateStr = aggregateTags.map(tag => tag.value).join(',')
      queryString += ` by {${agggregateStr}}`
    }

    setQueryVariables(vars =>
      Object.assign(
        {},
        vars,
        { query: queryString },
        calcQueryVariablesTimes(timePeriod, timeOffset)
      )
    )
  }, [
    measurement,
    fields,
    scope,
    aggregateTags,
    aggregationFunction,
    timePeriod,
    timeOffset,
    calcQueryVariablesTimes
  ])

  const skipTimePeriod = useCallback(
    direction => {
      const skipAmount = direction * timeValueToMs(timePeriod)

      setTimeOffset(offset => {
        const newOffset = offset + skipAmount
        return newOffset > 0 ? 0 : newOffset
      })
    },
    [timePeriod]
  )

  const setMeasurement = useCallback(value => {
    setMeasurementRaw(value)

    // Reset everything on measurement change
    setAggregateTags(null)
    setFields(null)
    setScope(null)
    setAggregationFunction(aggregationOptions[0])
  }, [])

  return (
    <ExploreContext.Provider
      value={{
        error,
        queryRefresh,
        measurementLoading,
        measurement,
        setMeasurement,
        measurementOptions,
        fieldOptions,
        tagPairsOptions,
        tagsOptions,
        fields,
        fieldData, //for units
        setFields,
        scope,
        setScope,
        aggregateTags,
        setAggregateTags,
        queryData,
        queryLoading,
        timePeriod,
        setTimePeriod,
        timeOptions,
        timeOffset,
        setTimeOffset,
        skipTimePeriod,
        queryVariables,
        resultsDisplayType,
        setResultsDisplayType,
        rollupInterval,
        setRollupInterval,
        aggregationOptions,
        aggregationFunction,
        setAggregationFunction
      }}
    >
      {children}
    </ExploreContext.Provider>
  )
}

export const useExploreContext = () => useContext(ExploreContext)
