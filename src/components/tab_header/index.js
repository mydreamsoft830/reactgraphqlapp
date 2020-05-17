import './tab_header.scss'

export const TabHeader = ({ children }) => {
  return <div className="tab-header">{children}</div>
}

export const TabDescription = ({ children }) => {
  return <div className="tab-description">{children}</div>
}

export const TabButtonContainer = ({ children }) => {
  return <div className="tab-button-container">{children}</div>
}
