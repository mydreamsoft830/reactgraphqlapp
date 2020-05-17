import { createContext, useState, useContext, useCallback } from 'react'

import './multistep.scss'

export const MultistepContext = createContext({})

export const MultistepContainer = ({ children, initialStep = 0 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const nextStep = useCallback(
    () => setCurrentStep((currentStep) => currentStep + 1),
    []
  )

  return (
    <MultistepContext.Provider
      value={{ currentStep, setCurrentStep, nextStep }}>
      <div
        className="multistep-container"
        style={{ '--current-step': currentStep }}>
        {children}
      </div>
    </MultistepContext.Provider>
  )
}

export const Step = ({ children, index }) => {
  return (
    <div className="step" style={{ '--step-index': index }}>
      {children}
    </div>
  )
}

export const useMultistep = () => {
  return useContext(MultistepContext)
}
