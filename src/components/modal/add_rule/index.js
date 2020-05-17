import { useCallback } from 'react'
import { Form } from 'components/form'
import { CreateRule } from 'graphql/mutations'
import { GetRules } from 'graphql/queries'
import { MultistepContainer, Step } from 'components/multistep'
import { useMutation } from '@apollo/client'
import { useStateContext } from 'context/state'
import { withLocalStateContext } from 'context/local_state'
import { toast } from 'react-toastify'
import mixpanel from 'mixpanel-browser'

import Step0 from './step_0'

import './add_rule.scss'

const AddRuleModal = withLocalStateContext(() => {
  const { selectedProject } = useStateContext()
  const [doCreateRule, { loading, error }] = useMutation(CreateRule)

  const doSubmit = useCallback(
    async (ruleParams) => {
      const ruleVars = {
        projectId: selectedProject.id,
        displayName: ruleParams.displayName,
        ruleSQLString:
          ruleParams.payloadType === 'json'
            ? `SELECT * from 'example/topic'`
            : `SELECT * from Sparkplug('example/topic')`
      }

      await doCreateRule({
        variables: ruleVars,
        refetchQueries: [GetRules]
      })

      toast.success('Successfully created rule')

      mixpanel.track('Created rule', {
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        displayName: ruleParams.displayName,
        payloadType: ruleParams.payloadType
      })

      return true
    },
    [doCreateRule, selectedProject]
  )

  const formErrors = error ? error.graphQLErrors[0].errors : null

  return (
    <Form
      initialState={{ displayName: '', payloadType: 'json' }}
      onSubmit={doSubmit}
      errors={formErrors}
      loading={loading}
    >
      <MultistepContainer>
        <Step index={0}>
          <Step0 />
        </Step>
      </MultistepContainer>
    </Form>
  )
})

export default AddRuleModal
