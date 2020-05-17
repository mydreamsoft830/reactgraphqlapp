import { useCallback, useMemo } from 'react'
import { useExploreContext } from './explore_context'
import { LoadingFullFrame } from 'components/loading'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TimeSelector } from 'components/time_selector'
import { timeValueToMs } from 'util/timeseries'
import { ExploreResultsTable } from './results_table'
import {
  colours,
  formatAsDateTime,
  tooltipLabelFormatter,
  tooltipValueFormatter,
  getCombinedUnits,
  getCombinedUnitsForLegend,
} from 'util/formatter'

const ExploreResultsGraphs = () => {
  const { queryData, fieldData } = useExploreContext()

  if (!queryData) return null
  return (
    <div>
      {queryData.map((data, i) => (
        <ExploreResultsGraph key={i} data={data} fieldsData={fieldData.timeseriesFields[i]} />
      ))}
    </div>
  )
}

const ExploreResultsGraph = ({ data, fieldsData }) => {
  const {
    queryVariables: { startTime, endTime },
    measurement
  } = useExploreContext()

  const series = useMemo(() => {
    const series = data.timestamps.map((time, i) => {
      const row = { time }

      data.fields.forEach(field => {
        row[field.name] = field.values[i]
      })

      return row
    })

    series.sort((a, b) => a.time - b.time)

    return series
  }, [data])

  const title = useMemo(() => {
    let title = measurement.value

    if (data.groupTags[0] !== '*') title += ' with ' + data.groupTags.join(', ')

    return title
  }, [measurement, data])
  return (
    <div className='result-graph'>
      <h3>{title}</h3>
      <ResponsiveContainer height={'80%'} width={'100%'}>
        <LineChart
          margin={{ top: 5, right: 32, bottom: 5, left: 0 }}
          data={series}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='time'
            tickFormatter={formatAsDateTime}
            type='number'
            domain={[startTime, endTime]}
          />
          <YAxis />
          <Tooltip
            formatter={tooltipValueFormatter}
            labelFormatter={tooltipLabelFormatter}
          />
          <Legend
            wrapperStyle={{ fontSize: '13px', margin: '0 0 0 15px' }}
            align='center'
            payload={
              data.fields.map(
                ({ name, }, i) => ({
                  id: name,
                  type: "line",
                  value: name + getCombinedUnitsForLegend(fieldsData.metadata),
                  color: colours[i % colours.length]

                })
              )
            }
          />
          {data.fields.map(({ name }, i) => (
            <Line
              key={i}
              dataKey={name}
              dot={false}
              unit={getCombinedUnits(fieldsData.metadata)}
              type='monotone'
              animationDuration={600}
              stroke={colours[i % colours.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
export const ExploreResults = () => {
  const {
    queryLoading,
    resultsDisplayType,
    setResultsDisplayType,
    timePeriod,
    setTimePeriod,
    timeOffset,
    setTimeOffset
  } = useExploreContext()

  const skipTimePeriod = useCallback(
    direction => {
      const skipAmount = direction * timeValueToMs(timePeriod)

      setTimeOffset(offset => {
        const newOffset = offset + skipAmount
        return newOffset > 0 ? 0 : newOffset
      })
    },
    [timePeriod, setTimeOffset]
  )

  return (
    <div className='explore-results'>
      <TimeSelector
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        timeOffset={timeOffset}
        setTimeOffset={setTimeOffset}
        skipTimePeriod={skipTimePeriod}
        resultsDisplayType={resultsDisplayType}
        setResultsDisplayType={setResultsDisplayType}
        graphSelect={true}
      />

      {queryLoading ? (
        <LoadingFullFrame />
      ) : resultsDisplayType === 'graph' ? (
        <ExploreResultsGraphs />
      ) : (
        <ExploreResultsTable />
      )}
    </div>
  )
}
