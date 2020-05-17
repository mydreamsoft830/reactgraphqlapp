import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Routes, Route } from 'react-router-dom'

import General from './general'
import Members from './members'
import Invitations from './invitations'

import { Tabs, Tab } from 'components/tabs'
import { GetProject } from 'graphql/queries'
import { LoadingFullFrame } from 'components/loading'
import Error from 'components/error'

const ProjectSettings = () => {
  const { projectId } = useParams()
  const { loading, error, data } = useQuery(GetProject, {
    variables: {
      projectId: projectId
    }
  })

  if (loading) return <LoadingFullFrame />
  if (error) return <Error error={error} />

  const project = data.project || null

  return (
    <>
      <h1>Project Settings</h1>

      <Tabs>
        <Tab name="General" path="general" index />
        <Tab name="Project Members" path="members" />
        <Tab name="Invitations" path="invitations" />
      </Tabs>

      <Routes>
        <Route index element={<General project={project} />} />
        <Route path="general" element={<General project={project} />} />
        <Route path="members" element={<Members project={project} />} />
        <Route path="invitations" element={<Invitations project={project} />} />
      </Routes>
    </>
  )
}

export default ProjectSettings
