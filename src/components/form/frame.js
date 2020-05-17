import './frame.scss'

const FormFrame = ({title, description, children}) => {

  return (
    <div className="form-frame">
      <div className="form-header">
        <h3>{ title }</h3>
        <span className="description">{ description }</span>
      </div>
      <div className="form-content">
        { children }
      </div>
    </div>
  )
}

export default FormFrame