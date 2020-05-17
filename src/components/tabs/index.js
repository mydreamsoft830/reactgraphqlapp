import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import './tabs.scss'

export const Tab = ({
  name,
  path,
  tabIndex,
  selectedTab,
  setSelectedTab,
  index
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const ref = useRef(null)

  const selected =
    (index && params['*'] === '') || location.pathname.endsWith(path)
  const className = selected ? 'selected' : ''

  useEffect(() => {
    if (selected && selectedTab.index !== tabIndex) {
      setSelectedTab({
        index: tabIndex,
        width: ref.current.offsetWidth,
        offset: ref.current.offsetLeft
      })
    }
  }, [location, selectedTab, setSelectedTab, tabIndex, selected])

  const clickHandler = useCallback(() => {
    navigate(path)
  }, [path, navigate])

  return (
    <span className={className} onClick={clickHandler} ref={ref} title={name}>
      {name}
    </span>
  )
}

export const Tabs = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState({
    index: -1,
    width: 0,
    offset: 0
  })

  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        tabIndex: index,
        selectedTab,
        setSelectedTab
      })
    }
    return child
  })

  return (
    <div
      className="tabs"
      style={{
        '--underline-offset': selectedTab.offset,
        '--underline-width': selectedTab.width
      }}>
      {childrenWithProps}
    </div>
  )
}
