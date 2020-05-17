import { useCallback, useEffect } from 'react'
import {
  TabHeader,
  TabDescription,
  TabButtonContainer
} from 'components/tab_header'
import Button from 'components/button'
import CallToAction, {
  CallToActionHeader,
  CallToActionDescription,
  CallToActionImage
} from 'components/call_to_action'
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody
} from 'components/table'
import AddRuleModal from 'components/modal/add_rule'
import { useModal } from 'context/modal'
import { RiDeleteBinLine } from 'react-icons/ri'
import { GrView } from 'react-icons/gr'
import Dropdown, { DropdownItem, DropdownSeparator } from 'components/dropdown'
import { GetRules } from 'graphql/queries'
import { useQuery } from '@apollo/client'
import { useStateContext } from 'context/state'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tabs, Tab } from 'components/tabs'
import { LoadingFullFrame } from 'components/loading'
// import { Sparklines, SparklinesLine } from 'react-sparklines'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { BsFileRuled } from 'react-icons/bs'
import { useRemoveRule } from 'hooks/rule'
import Error from 'components/error'

import './list.scss'

const RuleSparkLine = ({ rule }) => {
  return null
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

  const runCountData = data.timeseriesQuery[0]
    ? data.timeseriesQuery[0].fields[0].values
    : []

  return (
    <Sparklines data={runCountData} height={30}>
      <SparklinesLine color="blue" style={{ fill: 'none' }} />
    </Sparklines>
  )
  */
}

const RuleRow = ({ rule }) => {
  const { id, displayName } = rule
  const navigate = useNavigate()
  const removeRule = useRemoveRule(rule)

  const openRule = useCallback(() => {
    navigate(`/rules/${id}`)
  }, [navigate, id])

  return (
    <tr>
      <td>
        <div className="rule-name" onClick={openRule}>
          <span>
            <BsFileRuled />
          </span>
          <div>
            <span>{displayName}</span>
            <span>{id}</span>
          </div>
        </div>
      </td>

      <td className="spark-line">
        <RuleSparkLine rule={rule} />
      </td>

      <td>
        <Dropdown>
          <DropdownItem name="View" icon={<GrView />} onClick={openRule} />
          <DropdownSeparator />

          <DropdownItem
            name="Delete"
            icon={<RiDeleteBinLine />}
            className="red"
            onClick={removeRule}
          />
        </Dropdown>
      </td>
    </tr>
  )
}

const RuleList = () => {
  const { openModal } = useModal()
  const { selectedProject } = useStateContext()
  const location = useLocation()

  const { loading, error, data } = useQuery(GetRules, {
    variables: {
      projectId: selectedProject.id
    }
  })

  const openAddRule = useCallback(() => {
    openModal(() => <AddRuleModal />, { padding: false })
  }, [openModal])

  useEffect(() => {
    if (location.pathname.endsWith('/create')) {
      openAddRule()
    }
  }, [location, openAddRule])

  if (!selectedProject || loading) return <LoadingFullFrame />
  if (error) return <Error error={error} />

  const rules = data.rules || []

  return (
    <>
      <h1>Rules</h1>

      <Tabs>
        <Tab name="All Rules" path="list" index />
      </Tabs>

      <TabHeader>
        <TabDescription>
          Manage the flow of your data with rules to provide data logging and
          connectivity to external services.
        </TabDescription>

        <TabButtonContainer>
          <Button onClick={openAddRule}>Add New Rule</Button>
        </TabButtonContainer>
      </TabHeader>

      {rules.length === 0 ? (
        <CallToAction>
          <CallToActionImage>
            <AiOutlineFileSearch />
          </CallToActionImage>
          <CallToActionHeader>You don't have any rules yet.</CallToActionHeader>
          <CallToActionDescription>
            Add rules to perform actions on your incoming data.
          </CallToActionDescription>
          <CallToActionDescription>
            <Button onClick={openAddRule}>Add New Rule</Button>
          </CallToActionDescription>
        </CallToAction>
      ) : (
        <Table>
          <TableHeader>
            <TableHeaderColumn width={'40%'}>Name</TableHeaderColumn>
            <TableHeaderColumn width={'40%'}></TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <RuleRow key={rule.id} rule={rule} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default RuleList
