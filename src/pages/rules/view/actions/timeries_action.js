import { useCallback, useContext, useEffect } from 'react'

import Creatable from 'react-select/creatable'
import { Form, FormContext, SubmitButton, TextField } from 'components/form'
import { useMutation } from '@apollo/client'
import { GetRule } from 'graphql/queries'
import {
  CreateTimeseriesRuleAction,
  UpdateTimeseriesRuleAction,
} from 'graphql/mutations'
import { useStateContext } from 'context/state'
import { OutlineButton } from 'components/button'
import { useRemoveRuleAction } from 'hooks/rule_action'
import useMeasurementsOptions from 'hooks/use_measurements_options'
import useTagsOptions from 'hooks/use_tags_options'

const TagsField = () => {
  const {
    formState: { measurement, taggedFields },
    updateFormValue
  } = useContext(FormContext)

  const { loadTags, tagsOptions } = useTagsOptions(
    measurement ? measurement.value : null
  )

  useEffect(() => {
    if (measurement && measurement.value) loadTags()
  }, [measurement, loadTags])

  return (
    <div>
      <label>Tags</label>
      <Creatable
        value={taggedFields}
        onChange={(values) => updateFormValue('taggedFields', values)}
        options={tagsOptions}
        placeholder="Select your tag names"
        isMulti={true}
      />
    </div>
  )
}

const MeasurementField = () => {
  const { formState, updateFormValue } = useContext(FormContext)
  const { measurementOptions } = useMeasurementsOptions()

  return (
    <div>
      <label>Measurement</label>
      <Creatable
        value={formState.measurement}
        onChange={(values) => updateFormValue('measurement', values)}
        options={measurementOptions}
        placeholder="Select a measurement"
        isMulti={false}
      />
    </div>
  )
}

const TimeseriesActionDetail = ({
  isPublishAction,
  visible = false,
  action,
  rule,
  onCreate
}) => {
  const { selectedProject } = useStateContext()
  const doRemoveRuleAction = useRemoveRuleAction(rule, action)
  
  const [doCreateRuleAction, { loading }] = useMutation(
    CreateTimeseriesRuleAction
  )

  const [doUpdateRuleAction, { loading: updateLoading }] = useMutation(
    UpdateTimeseriesRuleAction
  )

  const submitTimeseriesAction = useCallback(
    async (action, { updateFormValue }) => {
      const variables = {
        projectId: selectedProject.id,
        ruleId: rule.id,
        displayName: action.displayName,
        ruleAction: {
          measurement: action.measurement.value || '',
          taggedFields: action.taggedFields.map((field) => field.value)
        }
      }

      if (action.id) {
        // Update rule
        await doUpdateRuleAction({
          variables: Object.assign({}, variables, {
            ruleActionId: action.id
          }),
          refetchQueries: [GetRule]
        })
      } else {
        // Create rule
        const result = await doCreateRuleAction({
          variables,
          refetchQueries: [GetRule]
        })

        updateFormValue('id', result.data.createTimeseriesRuleAction.id)
        onCreate(result.data.createTimeseriesRuleAction)
      }
    },
    [selectedProject, rule, doUpdateRuleAction, doCreateRuleAction, onCreate]
  )

  

  const classNames = ['edit-action']
  if (!visible) classNames.push('hidden')

  let formErrors = null

  /*
  // TODO: Correctly handle form errors when creating actions
  
  if (error) {
    console.dir(error)
    formErrors = error.graphQLErrors[0].errors
  }

  if (updateError) {
    if (formErrors) {
      formErrors = formErrors.concat(updateError.graphQLErrors[0].errors)
    } else {
      formErrors = updateError.graphQLErrors[0].errors
    }
  }
*/

  return (
    <div className={classNames.join(' ')}>
      <Form
        initialState={action}
        onSubmit={submitTimeseriesAction}
        errors={formErrors}
        loading={loading | updateLoading }
      >
        <h3>Timeseries Action</h3>

        <p>
          Inserts the output of the rule into the Timeseries database. Use tags
          to choose your indexed fields and all others will be inserted as
          fields
        </p>

        <TextField field="displayName" label="Display Name" required={true} />
        <MeasurementField />
        <TagsField />

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

export default TimeseriesActionDetail
