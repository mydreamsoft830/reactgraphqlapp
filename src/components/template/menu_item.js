import './menu-item.scss'

import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AiOutlineRight } from 'react-icons/ai'

const MenuItem = ({ name, icon, children, url, prefixes = [] }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const hasChildren = children ? true : false
  const urlMatches =
    location.pathname === url ||
    (prefixes.length > 0 &&
      prefixes.map((p) => location.pathname.startsWith(p)).includes(true))
  const isSelected = urlMatches || expanded
  const classNames = ['menu-item-container']

  useEffect(() => {
    if (!urlMatches) setExpanded(false)
  }, [location, urlMatches, setExpanded])

  const onClickHandler = useCallback(() => {
    if (url) navigate(url)
    else setExpanded((e) => !e)
  }, [navigate, url, setExpanded])

  if (hasChildren) classNames.push('expandable')
  if (isSelected) classNames.push('selected')

  return (
    <div className={classNames.join(' ')}>
      <div className="menu-item" onClick={onClickHandler}>
        <span className="icon">{icon}</span>
        <span>{name}</span>
        {hasChildren && (
          <span className="expand-icon">
            <AiOutlineRight />
          </span>
        )}
      </div>

      <div className="sub-menu-items">{children}</div>
    </div>
  )
}

export default MenuItem
