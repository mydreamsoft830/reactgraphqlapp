import './sidebar.scss'

const Sidebar = ({ children }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-inner">{children}</div>
    </div>
  )
}

export default Sidebar
