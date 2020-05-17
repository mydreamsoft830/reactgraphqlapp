import { useStyle } from 'context/style'

import './content.scss'

const Content = ({ children }) => {
  const { contentStyles } = useStyle()

  const classNames = ['content'].concat(contentStyles).join(' ')

  return <div className={classNames}>{children}</div>
}

export default Content
