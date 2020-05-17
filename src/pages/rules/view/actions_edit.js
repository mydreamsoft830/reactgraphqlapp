import { useCallback, useEffect, useState } from 'react'
import { v4 } from 'uuid'

import Dropdown, { DropdownItem } from 'components/dropdown'
import { MdQueryStats } from 'react-icons/md'
import { AiOutlinePlus, AiOutlineWarning } from 'react-icons/ai'
import TimeseriesActionDetail from './actions/timeries_action'
import PublishActionDetail from './actions/publish_action'
import mixpanel from 'mixpanel-browser'

const ActionItem = ({ selected, action, onClick = () => {} }) => {
  let type = ''
  const isUnsaved = action.id === null

  switch (action.__typename) {
    case 'TimeseriesRuleAction':
      type = 'Timeseries action'
      break
    case 'PublishRuleAction':
      type = 'Publish action'
      break
    default:
      throw new Error('Unsupported action type')
  }

  return (
    <span className={selected ? 'selected' : ''} onClick={onClick}>
      <div>
        <span>{action.displayName}</span>
        <span>{type}</span>
      </div>
      <div>{isUnsaved && <AiOutlineWarning />}</div>
    </span>
  )
}

export const ActionsEdit = ({ rule }) => {
  const [actions, setActions] = useState([])
  const [selectedActionId, setSelectedActionId] = useState(
    rule.actions[0] ? rule.actions[0].id : null
  )

  const addNewTimeseriesAction = useCallback(() => {
    const newAction = {
      __typename: 'TimeseriesRuleAction',
      id: null,
      unsaved_id: v4(),
      displayName: 'New Timeseries Action',
      measurement: '',
      taggedFields: []
    }

    setActions(actions => {
      const newActions = actions.concat([newAction])
      setSelectedActionId(newAction.unsaved_id)
      return newActions
    })

    mixpanel.track('Add timeseries action', {
      projectId: rule.projectId,
      ruleId: rule.id,
      ruleName: rule.displayName
    })
  }, [rule, setActions, setSelectedActionId])

  const addNewPublishAction = useCallback(() => {
    const newAction = {
      __typename: 'PublishRuleAction',
      id: null,
      unsaved_id: v4(),
      displayName: 'New Publish Action',
      measurement: '',
      taggedFields: []
    }

    setActions(actions => {
      const newActions = actions.concat([newAction])
      setSelectedActionId(newAction.unsaved_id)
      return newActions
    })

    mixpanel.track('Add publish action', {
      projectId: rule.projectId,
      ruleId: rule.id,
      ruleName: rule.displayName
    })
  }, [rule])

  useEffect(() => {
    setActions(
      rule.actions.map(action => {
        switch (action.__typename) {
          case 'TimeseriesRuleAction':
            return {
              __typename: action.__typename,
              id: action.id,
              displayName: action.displayName,
              measurement: {
                value: action.measurement,
                label: action.measurement
              },
              taggedFields: action.taggedFields.map(m => ({
                value: m,
                label: m
              })),
              unsaved: false
            }
          case 'PublishRuleAction':
            return {
              __typename: action.__typename,
              id: action.id,
              displayName: action.displayName,
              topic: action.topic
            }
          default:
            return null
        }
      })
    )
  }, [rule])

  const onActionCreate = useCallback(
    newAction => {
      setSelectedActionId(newAction.id)
    },
    [setSelectedActionId]
  )

  return (
    <>
      <h3>Actions</h3>

      <div className='action-edit'>
        <div className='actions-list'>
          <div className='action-header'>
            <Dropdown icon={<AiOutlinePlus />} align='left' size='20px'>
              <DropdownItem
                name='Add Timeseries Action'
                icon={<MdQueryStats />}
                onClick={addNewTimeseriesAction}
              />
              <DropdownItem
                name='Publish Action'
                icon={<MdQueryStats />}
                onClick={addNewPublishAction}
              />
            </Dropdown>
          </div>

          <div className='actions-list-items'>
            {actions.map((action, i) => (
              <ActionItem
                key={'add' + i}
                selected={(action.id || action.unsaved_id) === selectedActionId}
                action={action}
                onClick={() =>
                  setSelectedActionId(action.id || action.unsaved_id)
                }
              />
            ))}
          </div>
        </div>
        <div className='actions-detail'>
          {actions.map((action, i) => {
            console.dir(action.__typename)
            switch (action.__typename) {
              case 'TimeseriesRuleAction':
                return (
                  <TimeseriesActionDetail
                    key={action.id}
                    visible={
                      (action.id || action.unsaved_id) === selectedActionId
                    }
                    action={action}
                    rule={rule}
                    onCreate={onActionCreate}
                  />
                )
              case 'PublishRuleAction':
                return (
                  <PublishActionDetail
                    key={action.id}
                    visible={
                      (action.id || action.unsaved_id) === selectedActionId
                    }
                    action={action}
                    rule={rule}
                    onCreate={onActionCreate}
                  />
                )
              default:
                return null
            }
          })}
        </div>
      </div>
    </>
  )
}
