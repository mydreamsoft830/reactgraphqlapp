import { useCallback } from 'react'


import { Form, SubmitButton, TextField } from 'components/form'
import { useMutation } from '@apollo/client'
import { GetRule } from 'graphql/queries'
import {
  CreatePublishRuleAction,
  UpdatePublishRuleAction,

} from 'graphql/mutations'
import { useStateContext } from 'context/state'
import { OutlineButton } from 'components/button'
import { useRemoveRuleAction } from 'hooks/rule_action'

const PublishActionDetail = ({
  isPublishAction,
  visible = false,
  action,
  rule,
  onCreate
}) => {
  const { selectedProject } = useStateContext()
  const doRemoveRuleAction = useRemoveRuleAction(rule, action)

  const [doCreatePublishRuleAction, { loading: createPublishLoading }] = useMutation(
    CreatePublishRuleAction
  )

  const [doUpdatePublishRuleAction, { loading: updatePublishLoading }] = useMutation(
    UpdatePublishRuleAction
  )

  const submitPublishAction = useCallback(
    async (action, { updateFormValue }) => {
      const variables = {
        projectId: selectedProject.id,
        ruleId: rule.id,
        displayName: action.displayName,
        ruleAction: {
          topic: action.topic
        }
      }
      if (action.id) {
        // Update rule
        await doUpdatePublishRuleAction({
          variables: Object.assign({}, variables, {
            ruleActionId: action.id
          }),
          refetchQueries: [GetRule]
        })
      } else {
        // Create rule
        const result = await doCreatePublishRuleAction({
          variables,
          refetchQueries: [GetRule]
        })
        updateFormValue('id', result.data.createPublishRuleAction.id)
        onCreate(result.data.createPublishRuleAction)
      }
    },
    [selectedProject, rule, doUpdatePublishRuleAction, doCreatePublishRuleAction, onCreate]
  )

  const classNames = ['edit-action']
  if (!visible) classNames.push('hidden')

  let formErrors = null



  return (
    <div className={classNames.join(' ')}>
      <Form
        initialState={action}
        onSubmit={submitPublishAction}
        errors={formErrors}
        loading={createPublishLoading | updatePublishLoading}
      >
        <h3>Publish Action</h3>

        <p>
          Publish the output of a rule to MQTT where it can be subscribed to by other devices
          and services
        </p>

        <TextField field="displayName" label="Display Name" required={true} />
        <TextField field="topic" label="MQTT Topic" required={true} />
       
        <div className="action-edit-buttons">
          <SubmitButton />
          {action.id && (
            <OutlineButton onClick={doRemoveRuleAction}>Remove</OutlineButton>
          )}
        </div>
      </Form>
    </div>
  )
}

export default PublishActionDetail
