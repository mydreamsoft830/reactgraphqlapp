import './graph.scss'

import LineChartItem from './line_chart';
import BarChatItem from './bar_chart';


const GraphWidget = (props) => {
  const { widgetInfo, data, queryFields } = props

  return (
    <>
      {
        widgetInfo?.configuration.graphType === 'line' ? (
          <LineChartItem data={data} queryFields={queryFields} />
        ) : (
          <BarChatItem data={data} queryFields={queryFields} />
        )
      }
    </>
  )
}

export default GraphWidget
