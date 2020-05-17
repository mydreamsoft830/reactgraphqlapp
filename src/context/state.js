import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { useQuery } from '@apollo/client'

import useLocalStorage from 'hooks/use_local_storage'
import { ProjectsForUser } from 'graphql/queries'
import { LoadingFullFrame } from 'components/loading'

export const StateContext = createContext({})

export const StateContextProvider = (props) => {
  const { children } = props
  const { loading, error, data } = useQuery(ProjectsForUser)
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    'selectedProjectId',
    null
  )

  useEffect(() => {
    if (data && data.projects.length > 0) {
      setProjects(data.projects)
    }

    if (
      (selectedProjectId == null && data && data.projects.length > 0) ||
      (data &&
        data.projects.length > 0 &&
        !data.projects.find((project) => project.id === selectedProjectId))
    ) {
      setSelectedProjectId(data.projects[0].id)
    }
  }, [data, setSelectedProjectId, selectedProjectId])

  const setSelectedProject = useCallback(
    (project) => {
      setSelectedProjectId(project.id)
    },
    [setSelectedProjectId]
  )

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  )

  return (
    <StateContext.Provider
      value={{
        loading,
        error,
        projects,
        selectedProjectId,
        setSelectedProject,
        selectedProject
      }}
    >
      {error || loading || selectedProject == null ? (
        <LoadingFullFrame />
      ) : (
        children
      )}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
