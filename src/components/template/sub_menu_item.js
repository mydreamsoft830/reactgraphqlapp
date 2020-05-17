import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import './sub_menu_item.scss'

const SubMenuItem = ({ name, url }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const onClickHandler = useCallback(() => {
    if (url) navigate(url)
  }, [navigate, url])

  const classNames = ['sub-menu-item']
  if (location.pathname.startsWith(url)) classNames.push('selected')

  return (
    <div className={classNames.join(' ')} onClick={onClickHandler}>
      {name}
    </div>
  )
}

export default SubMenuItem
