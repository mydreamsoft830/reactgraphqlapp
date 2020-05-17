import { useParams } from 'react-router-dom'
import { LoadingFullFrame } from 'components/loading'
import { useQuery } from '@apollo/client'
import { useStateContext } from 'context/state'
import { GetRule } from 'graphql/queries'
import { Tabs, Tab } from 'components/tabs'
import { Routes, Route } from 'react-router-dom'
import DetailPageHeader from 'components/detail_page_header'
import { AiOutlineDown } from 'react-icons/ai'
import { RiDeleteBinLine } from 'react-icons/ri'
import { DropdownButton, DropdownItem } from 'components/dropdown'
import { useRemoveRule } from 'hooks/rule'
import Error from 'components/error'

import RuleDetails from './details'
import RuleEdit from './edit'
import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'

const RuleActions = ({ rule }) => {
  const removeRule = useRemoveRule(rule)

  const buttonContent = (
    <>
      Actions <AiOutlineDown />
    </>
  )

  return (
    <DropdownButton buttonContent={buttonContent}>
      <DropdownItem
        name="Delete Rule"
        icon={<RiDeleteBinLine />}
        className="red"
        onClick={removeRule}
      />
    </DropdownButton>
  )
}

const RuleView = () => {
  const { ruleId } = useParams()
  const { selectedProject } = useStateContext()

  const { loading, error, data } = useQuery(GetRule, {
    variables: {
      projectId: selectedProject.id,
      ruleId
    }
  })

  useEffect(() => {
    mixpanel.track('Viewed rule', {
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      ruleId
    })
  }, [selectedProject, ruleId])

  if (loading) return <LoadingFullFrame />
  if (error) return <Error error={error} />

  const rule = data.rule

  return (
    <>
      <DetailPageHeader
        text={rule.displayName}
        backUrl="/rules"
        backPageName="Rules"
        actionButton={<RuleActions rule={rule} />}
      >
        ID: <code>{rule.id}</code>
      </DetailPageHeader>

      <Tabs>
        <Tab name="Details" path="details" index />
        <Tab name="Edit" path="edit" />
      </Tabs>

      <Routes>
        <Route index element={<RuleDetails rule={rule} />} />
        <Route path="details" element={<RuleDetails rule={rule} />} />
        <Route path="edit" element={<RuleEdit rule={rule} />} />
      </Routes>
    </>
  )
}

export default RuleView

/*
  <Route path="details" element={<DeviceDetails device={device} />} />
*/
