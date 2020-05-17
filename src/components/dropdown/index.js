import { useRef, useState } from 'react'
import useClickOutside from 'hooks/use_click_outside'
import Button from 'components/button'

import { AiOutlineEllipsis } from 'react-icons/ai'

import './dropdown.scss'

export const DropdownItem = ({
  icon,
  name,
  className = '',
  onClick = () => {}
}) => {
  return (
    <div className={className} onClick={onClick}>
      <div>{icon}</div>
      <div>{name}</div>
    </div>
  )
}

export const DropdownSeparator = () => <div className="separator"></div>

const Dropdown = ({
  children,
  align = 'right',
  icon = <AiOutlineEllipsis />,
  size = '30px'
}) => {
  const ref = useRef()
  const [isOpen, setIsOpen] = useState(false)

  useClickOutside(ref, () => isOpen && setIsOpen(false))
  const className = `dropdown align-${align}`

  return (
    <div
      className={className}
      onClick={() => setIsOpen(!isOpen)}
      ref={ref}
      style={{ '--dropdown-size': size }}
    >
      <div className="icon">{icon}</div>
      {isOpen && <div className="dropdown-inner">{children}</div>}
    </div>
  )
}

export const DropdownButton = ({
  children,
  buttonContent,
  align = 'right',
  disabled = false
}) => {
  const ref = useRef()
  const [isOpen, setIsOpen] = useState(false)

  useClickOutside(ref, () => isOpen && setIsOpen(false))
  const className = `dropdown align-${align}` + (disabled ? ' disabled' : '')

  return (
    <div className={className} onClick={() => setIsOpen(!isOpen)} ref={ref}>
      <Button disabled={disabled}>{buttonContent}</Button>
      {isOpen && <div className="dropdown-inner">{children}</div>}
    </div>
  )
}

export default Dropdown
