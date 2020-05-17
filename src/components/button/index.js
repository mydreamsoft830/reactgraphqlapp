import './button.scss'

import { LoadingSmall } from 'components/loading'

const Button = ({
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}) => {
  const classNames = ['button', className]

  if (loading) classNames.push('loading')
  if (disabled) classNames.push('disabled')

  return (
    <div {...props} className={classNames.join(' ')}>
      {loading && <LoadingSmall />}
      <span className="button-content">{children}</span>
    </div>
  )
}

export const OutlineButton = (props) => {
  return (
    <Button className="outline" {...props}>
      {props.children}
    </Button>
  )
}

export const DangerButton = (props) => {
  return (
    <Button className="danger" {...props}>
      {props.children}
    </Button>
  )
}

export default Button
