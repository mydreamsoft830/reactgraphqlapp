import { useQuery } from '@apollo/client'
import { useStateContext } from 'context/state'
import { GetDashboardInfo } from 'graphql/queries'
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { useParams } from 'react-router-dom'

export const DashboardContext = createContext({})

export const DashboardContextProvider = props => {
  const { children } = props
  const { selectedProjectId } = useStateContext()
  const { dashboardId } = useParams()
  const [selectedDashboardId, setSelectedDashboardId] = useState(dashboardId)
  const [widgetInfo, setWidgetInfo] = useState()
  const [layoutWidth, setLayoutWidth] = useState(null)

  const { data, loading } = useQuery(
    GetDashboardInfo,
    {
      variables: {
        projectId: selectedProjectId,
        dashboardId: selectedDashboardId
      }
    }
  )

  useEffect(() => {
    setSelectedDashboardId(dashboardId)
    data && setWidgetInfo(data.dashboard)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardId, data]);

  const handleLayoutWidth = (width = null) => {
    layoutWidth !== width && setLayoutWidth(width)
  }


  return (
    <DashboardContext.Provider
      value={{
        selectedDashboardId,
        widgetInfo,
        setWidgetInfo,
        layoutWidth,
        handleLayoutWidth,
        loading
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => useContext(DashboardContext)
