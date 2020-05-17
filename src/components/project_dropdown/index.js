import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from 'context/state'
import useClickOutside from 'hooks/use_click_outside'
import { useModal } from 'context/modal'
import CreateProjectModal from 'components/modal/create_project'

import {
  AiFillCaretDown,
  AiOutlinePlusSquare,
  AiOutlineRight,
  AiOutlineLeft
} from 'react-icons/ai'
import { BsBox, BsPersonPlus } from 'react-icons/bs'
import { BiCog } from 'react-icons/bi'
import { FiRefreshCcw, FiCheck } from 'react-icons/fi'

import './project_dropdown.scss'

const DropdownFirstPane = ({ selected, setSelectedPane, closeDropdown }) => {
  const navigate = useNavigate()
  const { selectedProject } = useStateContext()
  const { openModal } = useModal()

  const classNames = ['first-pane']

  const openLink = useCallback(
    url => {
      navigate(url)
      closeDropdown()
    },
    [closeDropdown, navigate]
  )

  const openNewProject = useCallback(() => {
    openModal(() => <CreateProjectModal />)
    closeDropdown()
  }, [openModal, closeDropdown])

  if (!selected) classNames.push('hidden')

  return (
    <div className={classNames.join(' ')}>
      <div>
        <div className='icon'>
          <BsBox size={20} />
        </div>

        <div className='name'>
          <span>{selectedProject.name}</span>
          <span>{selectedProject.environment || 'Development'}</span>
        </div>
      </div>

      <div
        className='dropdown-item'
        onClick={() => openLink(`/project/${selectedProject.id}`)}
      >
        <span>
          <BiCog size={18} />
        </span>
        <span>Settings</span>
      </div>

      <div
        className='dropdown-item'
        onClick={() => openLink(`/project/${selectedProject.id}/invitations`)}
      >
        <span>
          <BsPersonPlus size={18} />
        </span>
        <span>Invite a member</span>
      </div>

      <div className='separator' />

      <div className='dropdown-item' onClick={openNewProject}>
        <span>
          <AiOutlinePlusSquare size={18} />
        </span>
        <span>Create Project</span>
      </div>

      <div className='dropdown-item' onClick={() => setSelectedPane(2)}>
        <span>
          <FiRefreshCcw size={18} />
        </span>
        <span>Switch Project</span>
        <span>
          <AiOutlineRight />
        </span>
      </div>
    </div>
  )
}

const ProjectListItem = ({ project, selected, closeDropdown }) => {
  const navigate = useNavigate()
  const { setSelectedProject } = useStateContext()
  const className = selected ? 'selected' : ''

  const onClickHandler = useCallback(() => {
    setSelectedProject(project)
    navigate('/')
    closeDropdown()
  }, [project, setSelectedProject, navigate, closeDropdown])

  return (
    <div className={className} onClick={onClickHandler}>
      <div>
        <span>{project.name}</span>
        <span>{project.environment || 'Development'}</span>
      </div>
      <div>{selected && <FiCheck size={20} />}</div>
    </div>
  )
}

const DropdownSecondPane = ({ selected, setSelectedPane, closeDropdown }) => {
  const { projects, selectedProject } = useStateContext()
  const classNames = ['second-pane']

  if (!selected) classNames.push('hidden')

  return (
    <div className={classNames.join(' ')}>
      <div className='project-header'>
        <div onClick={() => setSelectedPane(1)}>
          <AiOutlineLeft />
        </div>

        <span>Select Project</span>
      </div>
      <div className='project-list'>
        {projects.map(project => (
          <ProjectListItem
            key={project.id}
            project={project}
            selected={project === selectedProject}
            closeDropdown={closeDropdown}
          />
        ))}
      </div>
    </div>
  )
}

const ProjectDropdownBox = ({ closeDropdown }) => {
  const [selectedPane, setSelectedPane] = useState(1)

  return (
    <div className='project-dropdown-inner' onClick={e => e.stopPropagation()}>
      <DropdownFirstPane
        selected={selectedPane === 1}
        setSelectedPane={setSelectedPane}
        closeDropdown={closeDropdown}
      />
      <DropdownSecondPane
        selected={selectedPane === 2}
        setSelectedPane={setSelectedPane}
        closeDropdown={closeDropdown}
      />
    </div>
  )
}

const ProjectDropdown = () => {
  const { selectedProject } = useStateContext()
  const [isDropdownOpen, setIsDropdownOpen] = useState(true)
  const ref = useRef()

  useClickOutside(ref, () => isDropdownOpen && setIsDropdownOpen(false))

  useEffect(() => {
    setIsDropdownOpen(false)
  }, [selectedProject])

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  if (!selectedProject) return null

  return (
    <div
      className='project-dropdown'
      ref={ref}
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <div>
        <span>{selectedProject.name}</span>
        <span>{selectedProject.environment || 'Development'}</span>
      </div>

      <AiFillCaretDown />

      {isDropdownOpen && <ProjectDropdownBox closeDropdown={closeDropdown} />}
    </div>
  )
}

export default ProjectDropdown
