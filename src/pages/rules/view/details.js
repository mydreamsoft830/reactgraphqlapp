import './details.scss'
//import { useMemo } from 'react'
import DateComponent from 'components/date'
//import { useStateContext } from 'context/state'
// import { useQuery } from '@apollo/client'
// import { GetTimeseriesQueryData } from 'graphql/queries'
import CodeEditor from '@uiw/react-textarea-code-editor'

const InvocationsGraph = ({ rule }) => {
  /*
  const { selectedProject } = useStateContext()

  const variables = useMemo(() => {
    return {
      projectId: selectedProject.id,
      query: `sum:rules(runCount){ruleId:${rule.id}}`,
      startTime: Date.now() - 24 * 60 * 60 * 1000,
      endTime: Date.now(),
      rollupInterval: 60 * 60 * 1000
    }
  }, [selectedProject, rule])

  const { data, loading } = useQuery(GetTimeseriesQueryData, {
    variables: variables
  })


  if (loading) return null
  */

  // TODO: Render a graph of runtime invocations
  return null
}

const Detail = ({ label, value }) => (
  <div>
    <span>{label}</span>
    <span>{value}</span>
  </div>
)

const RuleDetails = ({ rule }) => {
  return (
    <div className="rule-details">
      <div className="details-frame">
        <Detail label="ID" value={rule.id} />
        <Detail label="Display Name" value={rule.displayName} />
        <Detail
          label="Created"
          value={<DateComponent time={rule.createdAt} />}
        />
        <Detail
          label="Last Updated"
          value={<DateComponent time={rule.updatedAt} />}
        />
      </div>

      <div className="details-rulestring">
        <span>Rule</span>

        <CodeEditor
          value={rule.ruleSQLString}
          language="SQL"
          onChange={() => {}}
          padding={15}
          style={{
            fontSize: 12,
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
          }}
          readOnly={true}
        />
      </div>

      <div className="details-graph">
        <InvocationsGraph rule={rule} />
      </div>
    </div>
  )
}

export default RuleDetails
