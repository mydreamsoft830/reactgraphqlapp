import { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useModal } from 'context/modal'
import { useStateContext } from 'context/state'
import {
  DashboardContextProvider,
  useDashboardContext
} from './dashboard_context'
import { useFullWidthContentStyle } from 'context/style'
import { useMutation } from '@apollo/client'
import { UpdateDashboardWidget } from 'graphql/mutations'
import Error from 'components/error'

import RGL, { WidthProvider } from 'react-grid-layout'
import Button from 'components/button'
import WidgetItem from 'components/widgets'
import AddWidgetModal from 'components/modal/add_widget'
import EditWidgetModal from 'components/modal/edit_widget'
import { TimeSelector } from 'components/time_selector'
import { timeOptions, timeValueToMs } from 'util/timeseries'

import { LoadingFullFrame } from 'components/loading'

import './dashboard_view.scss'

const ReactGridLayout = WidthProvider(RGL)

const props = {
  isDraggable: true,
  isResizable: true,
  items: 10,
  rowHeight: 30,
  preventCollision: false,
  cols: 12
}

const DashboardContent = props => {
  const { selectedProject } = useStateContext()
  const { selectedDashboardId, widgetInfo, handleLayoutWidth, layoutWidth, loading } = useDashboardContext()

  const [updateDashboardWidget, { loading: saving, error }] = useMutation(
    UpdateDashboardWidget
  )
  const [widgetLayout, setWidgetLayout] = useState([])
  const [timePeriod, setTimePeriod] = useState(timeOptions[0])
  const [timeOffset, setTimeOffset] = useState(0)
  const [resultsDisplayType, setResultsDisplayType] = useState('graph')
  const saveButtonRef = useRef()
  const [changeFlag, setChangeFlag] = useState(0)

  useLayoutEffect(() => {    
    window.addEventListener('resize', getSize)
    getSize()
    return () => window.removeEventListener('resize', getSize)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFullWidthContentStyle()

  useEffect(() => {
    setTimeOffset(0)
  }, [timePeriod])

  useEffect(() => {
    !saving &&
      widgetInfo &&
      setWidgetLayout(widgetInfo.widgets.map(item => item.position))
    setChangeFlag(0)
  }, [widgetInfo, saving])

  const skipTimePeriod = useCallback(
    direction => {
      const skipAmount = direction * timeValueToMs(timePeriod)

      setTimeOffset(offset => {
        const newOffset = offset + skipAmount
        return newOffset > 0 ? 0 : newOffset
      })
    },
    [timePeriod]
  )

  const getSize = () => {
    const layoutComponent = document.getElementsByClassName('react-grid-layout')
    const width = layoutComponent && layoutComponent.length > 0 ? layoutComponent[0].offsetWidth : 0
    handleLayoutWidth(width)
  }

  const handleChangeLayout = useCallback(
    layout => {
      setWidgetLayout(layout)
      setChangeFlag(changeFlag + 1)
      getSize()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setWidgetLayout, setChangeFlag, changeFlag]
  )

  const saveChangeLayout = useCallback(async () => {
    const button = saveButtonRef.current.getElementsByClassName('button')
    if (!button[0].classList.contains('disabled')) {
      try {
        if (!saving) {
          for (const widget of widgetInfo.widgets) {
            const index = widgetInfo.widgets.indexOf(widget)

            await updateDashboardWidget({
              variables: {
                projectId: selectedProject.id,
                dashboardId: selectedDashboardId,
                dashboardWidgetId: widget.id,
                displayName: widget.displayName,
                type: widget.type,
                configuration: widget.configuration,
                position: {
                  x: widgetLayout[index].x,
                  y: widgetLayout[index].y,
                  w: widgetLayout[index].w,
                  h: widgetLayout[index].h
                }
              }
            })
          }
          setChangeFlag(1)
        }
      } catch (e) {
        console.log('error:', e)
      }
    }
  }, [
    selectedDashboardId,
    selectedProject,
    widgetInfo,
    widgetLayout,
    saving,
    updateDashboardWidget
  ])

  const timeProps = {
    timePeriod,
    setTimePeriod,
    timeOffset,
    setTimeOffset,
    resultsDisplayType,
    setResultsDisplayType,
    skipTimePeriod
  }

  if (error) return <Error error={error} />

  return (
    <div className='dashboard-content'>
      <div className='dashboard-content-header'>
        <h1>{widgetInfo && widgetInfo.displayName}</h1>
        <TimeSelector {...timeProps} graphSelect={false} />
        <div className='controls'>
          <Button onClick={props.addWidget}>Add New Widget</Button>
        </div>
      </div>
      {loading ? (
        <LoadingFullFrame />
      ) : (
        <ReactGridLayout
          layout={widgetLayout}
          onLayoutChange={handleChangeLayout}
        >
          {widgetLayout.map((item, idx) => (
            <div key={idx} data-grid={item}>
              {
                widgetInfo.widgets[idx]?.type && <WidgetItem {...props} {...timeProps} widgetInfo={widgetInfo.widgets[idx]} layout={widgetLayout[idx]} layoutWidth={layoutWidth} />
              } 
            </div>
          ))}
        </ReactGridLayout>
      )}
      <div className='controls save-button' ref={saveButtonRef}>
        <Button
          className={changeFlag < 2 ? 'disabled' : ''}
          onClick={saveChangeLayout}
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
} 

const DashboardContainer = props => {
  const { selectedDashboardId, error } = useDashboardContext()
  const { openModal } = useModal()

  const openAddWidgetModal = useCallback(() => {
    openModal(() => <AddWidgetModal selectedDashboardId={selectedDashboardId} />, { padding: false, modalSize: true })
  }, [openModal, selectedDashboardId])

  const openEditWidget = useCallback((widgetInfo, setMultiQueryVariables, multiQueryVariables) => {
    const props = {
      selectedDashboardId,
      widgetInfo,
      multiQueryVariables,
      setMultiQueryVariables,
    }
    openModal(() => <EditWidgetModal {...props} />, { padding: false, modalSize: true })
  }, [openModal, selectedDashboardId])

  if (error) return <Error error={error} />

  return (
    <div className='dashboard-container'>
      <DashboardContent
        props={props}
        addWidget={openAddWidgetModal}
        editWidget={openEditWidget}
      />
    </div>
  )
}

const DashboardView = () => {
  return (
    <DashboardContextProvider>
      <DashboardContainer props={props} />
    </DashboardContextProvider>
  )
}

export default DashboardView
