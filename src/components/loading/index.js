import './loading.scss'

import EnviradaLogoMini from './ese-core-logo.png'

export const LoadingSmall = () => {
  return (
    <div className="loading-small lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export const LoadingFullFrame = ({ message }) => {
  const classNames = ['loading-full-frame']

  if (message) classNames.push('with-message')

  return (
    <div className={classNames.join(' ')}>
      <div className="inner">
        <img src={EnviradaLogoMini} alt="Loading icon" />
        {message && <span>{message}</span>}
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
