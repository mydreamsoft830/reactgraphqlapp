import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames'
// import { useExploreContext } from './explore_context'
import { useStateContext } from 'context/state'
import { LoadingFullFrame } from 'components/loading'
import { GetTimeseriesTags } from 'graphql/queries'
import './results_table.scss'

export const ResultTable = ({ measurement }) => {
  const { selectedProject } = useStateContext()
  const [tagKeys, setTagKeys] = useState([]);
  const [tagValues, setTagValues] = useState([]);
  const { loading, error, data, refetch } = useQuery(GetTimeseriesTags, {
    variables: {
      projectId: selectedProject.id,
      measurement: measurement.name,
    },
    refetchQueries: [GetTimeseriesTags]
  })
  useEffect(() => {
    if (!error && data) {
      let tagKeys = []
      let tagValues = []
      let tmpKeys = data.timeseriesTags.map((item, idx) => item.name)
      let tmpValues = data.timeseriesTags.map((item, midx) => item.value)
      let i = 0
      for (i = 0; i < tmpKeys.length; i++) {
        if (!tagKeys.includes(tmpKeys[i])) {
          tagKeys.push(tmpKeys[i])
          tagValues.push([tmpKeys[i] + ':' + tmpValues[i] + '  '])
        } else {
          let index = tagKeys.indexOf(tmpKeys[i])
          tagValues[index].push(tmpKeys[i] + ':' + tmpValues[i] + '  ')
        }
      }
      setTagKeys(tagKeys)
      setTagValues(tagValues)
      refetch()
    } else {
      setTagKeys([])
      setTagValues([])
    }
  }, [loading, error, data, refetch])

  if (loading) return <LoadingFullFrame />
  if (tagKeys.length === 0) return null // TODO: Call to action or not data

  const columnNames = ['Tag Key', 'Count', 'Tag Values']

  const headerColumns = columnNames.map((columnName, i) => (
    <th className={classNames({ 'align-right': i === 1 })} key={i.toString()}>{columnName}</th>
  ))

  const dataRows = tagKeys.map((key, i) =>
    <tr key={'tr' + i.toString()}>
      <td  >
        {key}
      </td>
      <td className={classNames({ 'align-right': true })} >
        {tagValues[i].length}
      </td>
      <td >
        {tagValues[i]}
      </td>
    </tr>
  )

  return (
    <div className="summary-results-table">
      <table>
        <thead>
          <tr>{headerColumns}</tr>
        </thead>
        <tbody>{dataRows}</tbody>
      </table>
    </div>
  )
}

export const SummaryResultsTable = ({ measurement }) => {
  //need to fetch

  return (
    <ResultTable measurement={measurement} />
  )
}
