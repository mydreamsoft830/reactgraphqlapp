import { useState, useRef, useCallback, useContext } from 'react'

import './header.scss'

import EnviradaLogo from './envirada-logo.png'
import Separator from './separator.png'

import { BiUserCircle } from 'react-icons/bi'
import { IoIosLogOut } from 'react-icons/io'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { useAuth0 } from '@auth0/auth0-react'
import useClickOutside from 'hooks/use_click_outside'
import { useNavigate } from 'react-router-dom'
import { AiOutlineMail } from 'react-icons/ai'
import { BsMoonStarsFill } from 'react-icons/bs'
import { User } from 'graphql/queries'
import { useQuery } from '@apollo/client'
import { ThemeContext } from '../../context/theme_context'
import ProjectDropdown from 'components/project_dropdown'

const UserDropdown = ({ closeDropdown, invitesCount }) => {
  const { theme, setTheme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const { user, logout } = useAuth0()

  const openLink = useCallback(
    url => {
      navigate(url)
      closeDropdown()
    },
    [navigate, closeDropdown]
  )

  const handleThemeChange = useCallback(() => {
    const isCurrentDark = theme === 'dark'
    const newTheme = isCurrentDark ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('default-theme', newTheme)
  }, [theme, setTheme])

  return (
    <div className='header-user-dropdown' onClick={e => e.stopPropagation()}>
      <div className='user' onClick={() => openLink(`/profile/general`)}>
        <img src={user.picture} alt='user avatar' />
        <div>
          <span>{user.name}</span>
          <span>{user.email}</span>
        </div>
      </div>

      <div className='user-separator' />
      <div className='dropdown-item' onClick={handleThemeChange}>
        <span>
          <BsMoonStarsFill size={14} />
        </span>
        <span>Dark Mode</span>
        <div className='toggle-btn-section'>
          <div className={`toggle-checkbox m-vertical-auto`}>
            <input
              className='toggle-btn__input'
              type='checkbox'
              name='checkbox'
              onChange={handleThemeChange}
              checked={theme === 'dark'}
            />
            <button
              type='button'
              className={`toggle-btn__input-label`}
              onClick={handleThemeChange}
            ></button>
          </div>
        </div>
      </div>
      <div
        className='dropdown-item'
        onClick={() => openLink(`/profile/invitations`)}
      >
        <span>
          <AiOutlineMail size={18} />
        </span>
        <span>
          My Invitations
          {invitesCount > 0 && (
            <span className='inline-notification-count'>{invitesCount}</span>
          )}
        </span>
      </div>

      <div className='dropdown-item' onClick={logout}>
        <span>
          <IoIosLogOut size={18} />
        </span>
        <span>Logout</span>
      </div>
    </div>
  )
}

const HeaderContent = () => {
  const { user } = useAuth0()
  const { data } = useQuery(User)
  const [userDropdownShow, setUserDropdownShow] = useState(false)
  const ref = useRef()

  useClickOutside(ref, () => userDropdownShow && setUserDropdownShow(false))

  const closeDropdown = useCallback(() => {
    setUserDropdownShow(false)
  }, [])

  const invitesCount = data?.user?.invites?.length || 0

  return (
    <>
      <span className='header-services'>
        <ProjectDropdown />
      </span>

      <a
        className='header-docs-link'
        target='_blank'
        rel='noreferrer'
        href={process.env.REACT_APP_DOCS_URL}
      >
        <HiOutlineBookOpen />
        Docs
      </a>

      <span className='header-user-contianer' ref={ref}>
        <span
          className='header-user'
          onClick={() => setUserDropdownShow(!userDropdownShow)}
        >
          <BiUserCircle size={22} />
          {user.name}
          {invitesCount > 0 && (
            <span className='inline-notification-count animate'>
              {invitesCount}
            </span>
          )}

          {userDropdownShow && (
            <UserDropdown
              closeDropdown={closeDropdown}
              invitesCount={invitesCount}
            />
          )}
        </span>
      </span>
    </>
  )
}

const Header = () => {
  return (
    <div className='header'>
      <span className='header-logo'>
        <img src={EnviradaLogo} alt='Logo' />
      </span>
      <span className='separator'>
        <img src={Separator} alt='Logo' />
      </span>
      <span className='header-content'>
        <HeaderContent />
      </span>
    </div>
  )
}

export default Header
