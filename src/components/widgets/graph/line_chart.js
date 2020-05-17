import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

import {
  colours,
  formatAsDateTime,
  tooltipLabelFormatter,
  tooltipValueFormatter,
  getCombinedUnits,
  getCombinedUnitsForLegend,
} from 'util/formatter'

const LineChartItem = props => {
  const { data, queryFields } = props

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={data}
        margin={{ top: 20, right: 20, left: -25, bottom: 10 }}
      >
        <XAxis
          dataKey='timestamp'
          tickFormatter={formatAsDateTime}
          fontFamily='sans-serif'
          tick={{ fontSize: 10 }}
          tickSize={4}
          dy={10}
        />
        <YAxis
          domain={[0, 'dataMax']}
          tickCount={6}
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          type='number'
          tickFormatter={tickItem => tickItem.toFixed(0)}
        />
        <CartesianGrid vertical={false} stroke='#ebf3f0' />
        <Tooltip
          formatter={tooltipValueFormatter}
          labelFormatter={tooltipLabelFormatter}
          wrapperStyle={{ fontSize: '13px' }}
        />
        {queryFields &&
          queryFields.map(({ name, metadata }, i) => (
            <Line
              key={i}
              dataKey={name}
              dot={false}
              type='monotone'
              animationDuration={600}
              stroke={colours[i % colours.length]}
              unit={getCombinedUnits(metadata)}
            />
          ))}
        <Legend
          wrapperStyle={{ fontSize: '13px', margin: '0 0 0 15px' }}
          align='center'
          payload={
            queryFields.map(
              ({ name, metadata }, i) => ({
                id: name,
                type: "line",
                value: name + getCombinedUnitsForLegend(metadata),
                color: colours[i % colours.length]

              })
            )
          }
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineChartItem
