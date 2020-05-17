import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  TextField,
  SubmitButton,
  EnvironmentSelector
} from 'components/form'
import { useStateContext } from 'context/state'
import { useModal } from 'context/modal'
import mixpanel from 'mixpanel-browser'

import { CreateProject } from 'graphql/mutations'
import { ProjectsForUser } from 'graphql/queries'
import { toast } from 'react-toastify'

const CreateProjectModal = () => {
  const [doCreateProject, { loading, error }] = useMutation(CreateProject)
  const { setSelectedProject } = useStateContext()
  const { closeModal } = useModal()
  const navigate = useNavigate()

  const createProject = useCallback(
    async (project) => {
      const result = await doCreateProject({
        variables: {
          ...project
        },
        refetchQueries: [ProjectsForUser]
      })

      setSelectedProject(result.data.createProject)

      toast.success('Successfully created project')

      mixpanel.track('Create project', {
        ...project
      })

      closeModal()
      navigate('/')
    },
    [doCreateProject, setSelectedProject, closeModal, navigate]
  )

  const formErrors = error ? error.graphQLErrors[0].errors : null

  return (
    <>
      <h1>Create Project</h1>

      <Form
        initialState={{ name: '', environment: 'development' }}
        onSubmit={createProject}
        errors={formErrors}
        loading={loading}
      >
        <TextField label="Name" field="name" />
        <EnvironmentSelector label="Environment Tag" field="environment" />
        <SubmitButton />
      </Form>
    </>
  )
}

export default CreateProjectModal
