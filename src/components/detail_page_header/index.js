import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router'
import './detail_page_header.scss'

const DetailPageHeader = ({
  text,
  children,
  backUrl,
  backPageName,
  actionButton
}) => {
  const navigate = useNavigate()

  return (
    <div className="page-detail-header">
      <div className="buttons">
        {backUrl && (
          <div className="back" onClick={() => navigate(backUrl)}>
            <BsArrowLeft /> Back {backPageName ? `to ${backPageName}` : ``}
          </div>
        )}
        {actionButton && <div className="actions">{actionButton}</div>}
      </div>
      <h1>{text}</h1>
      {children && <div className="sub-header">{children}</div>}
    </div>
  )
}

export default DetailPageHeader
