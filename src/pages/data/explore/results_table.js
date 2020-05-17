import { useMemo } from 'react'
import { useExploreContext } from './explore_context'
import { DateWithSeconds } from 'components/date'

export const ResultTable = ({ data }) => {
  if (data.length === 0) return null // TODO: Call to action or not data

  const columnNames = Object.keys(data[0])
  const headerColumns = columnNames.map((columnName, i) => (
    <th key={i}>{columnName}</th>
  ))

  const dataRows = data.map((row, i) => (
    <tr key={i}>
      {columnNames.map((columnName, j) => {
        if (columnName === 'timestamp') {
          return (
            <td key={j}>
              <DateWithSeconds time={row[columnName]} />
            </td>
          )
        } else {
          const isNumber = typeof row[columnName] === 'number'
          return (
            <td key={j}>
              {isNumber ? row[columnName].toFixed(3) : row[columnName]}
            </td>
          )
        }
      })}
    </tr>
  ))

  return (
    <div className="explore-results-table">
      <table>
        <thead>
          <tr>{headerColumns}</tr>
        </thead>
        <tbody>{dataRows}</tbody>
      </table>
    </div>
  )
}

export const ExploreResultsTable = () => {
  const { queryData } = useExploreContext()
  const data = useMemo(() => {
    const rows = []

    if (!queryData) return rows

    queryData.forEach((series) => {
      const rowTempate = {}

      if (series.groupTags[0] !== '*') {
        series.groupTags.forEach((tagStr) => {
          const [name, value] = tagStr.split('=')
          rowTempate[name] = value
        })
      }

      series.timestamps.forEach((timestamp, i) => {
        const row = Object.assign({ timestamp }, rowTempate)

        series.fields.forEach((field) => {
          row[field.name] = field.values[i]
        })

        rows.push(row)
      })
    })

    return rows.sort((a, b) => a.timestamp - b.timestamp)
  }, [queryData])

  return <ResultTable data={data} />
}
