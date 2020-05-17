import {
  BarChart,
  ResponsiveContainer,
  Bar,
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

const BarChatItem = props => {
  const { data, queryFields } = props

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
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
        ></XAxis>
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
            <Bar key={i}
              dataKey={name}
              unit={getCombinedUnits(metadata)}
              fill={colours[i % colours.length]} />
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
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChatItem
