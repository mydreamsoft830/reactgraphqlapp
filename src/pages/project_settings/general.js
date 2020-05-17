import { useCallback } from 'react'
import { useMutation } from '@apollo/client'

import {
  Form,
  FormFrame,
  TextField,
  SubmitButton,
  EnvironmentSelector
} from 'components/form'
import { UpdateProject } from 'graphql/mutations'
import { GetProject } from 'graphql/queries'

const ENV_DESCRIPTION =
  'Assign an environment tag to your project to differentiate between development, staging and production environments.'

const General = ({ project }) => {
  const [doUpdateProject, { loading, error }] = useMutation(UpdateProject)

  const updateProject = useCallback(
    (project) => {
      doUpdateProject({
        variables: {
          projectId: project.id,
          name: project.name,
          environment: project.environment
        },
        refetchQueries: [GetProject]
      })
    },
    [doUpdateProject]
  )

  const formErrors = error ? error.graphQLErrors[0].errors : null

  return (
    <Form
      initialState={project}
      onSubmit={updateProject}
      errors={formErrors}
      loading={loading}>
      <FormFrame title="Settings">
        <TextField label="Name" field="name" />
        <SubmitButton />
      </FormFrame>

      <FormFrame title="Environment" description={ENV_DESCRIPTION}>
        <EnvironmentSelector
          label="Assign Environment Tag"
          field="environment"
        />
        <SubmitButton />
      </FormFrame>
    </Form>
  )
}

export default General
