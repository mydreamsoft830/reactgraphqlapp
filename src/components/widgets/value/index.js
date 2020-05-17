import { useEffect, useState } from 'react'
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts'
import {
  getCombinedUnits,
} from 'util/formatter'
import './value.scss'

const ValueWidgetBackground = ({ show, data }) => {
  if (!show || data.length === 0) return null

  const keys = Object.keys(data[0]).filter(key => key !== 'timestamp')

  return (
    <ResponsiveContainer width='100%'>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <Area
          dataKey={keys[0]}
          dot={false}
          isAnimationActive={false}
          stroke='#e9ecf0'
          fill='#e9ecf0'
        />
        <YAxis
          domain={[0, 'dataMax']}
          tickCount={3}
          tick={{ fontSize: 10 }}
          tickLine={true}
          axisLine={false}
          allowDecimals={false}
          type='number'
          mirror={true}
          tickFormatter={tickItem => tickItem.toFixed(0)}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const ValueWidget = props => {
  const { widgetInfo, data, queryFields } = props
  const [lastValue, setLastValue] = useState(0)
  useEffect(() => {
    if (data.length === 0) {
      setLastValue(0)
      return
    }

    const keys = Object.keys(data[0]).filter(key => key !== 'timestamp')

    if (keys.length > 0) {
      setLastValue(data[data.length - 1][keys[0]] || 0)
    }
  }, [data])

  return (
    <>
      <ValueWidgetBackground
        show={widgetInfo?.configuration?.toggleGraph}
        data={data}
      />
      <h2 className='last-value'>
        {(lastValue instanceof Number) ? lastValue.toFixed(2) + getCombinedUnits(queryFields[queryFields.length - 1].metadata) : lastValue + getCombinedUnits(queryFields[queryFields.length - 1].metadata)}
        <span>{/* TODO: Use metadata API for units */}</span>
      </h2>

    </>
  )
}

export default ValueWidget
