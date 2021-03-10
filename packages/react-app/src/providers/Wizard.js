import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const WizardContext = React.createContext()

function WizardProvider({ children }) {
  const [step, setStep] = useState(0)
  const [token, setToken] = useState('')
  const [duration, setDuration] = useState(0)
  const [cliff, setCliff] = useState(0)
  const [upfront, setUpfront] = useState(0)
  const [settings, setSettings] = useState(null)
  const [data, setData] = useState(null)
  const [partyAddress, setPartyAddress] = useState('')

  const onNext = useCallback(() => setStep((step) => step + 1), [])

  const onBack = useCallback(() => setStep((step) => Math.max(0, step - 1)), [])

  const onTokenChange = useCallback((event) => setToken(event.target.value), [])

  const onDurationChange = useCallback(
    (event) => setDuration(parseInt(event.target.value)),
    []
  )

  const onCliffChange = useCallback(
    (event) => setCliff(parseInt(event.target.value)),
    []
  )

  const onUpfrontChange = useCallback(
    (value) => setUpfront(Math.round(value * 100) / 100),
    []
  )

  const onSettingsChange = useCallback((settings) => setSettings(settings), [])

  const onDataChange = useCallback((data) => setData(data), [])
  const onPartyAddressChange = useCallback(
    (address) => setPartyAddress(address),
    []
  )

  const resetData = useCallback(() => {
    setStep(0)
    setToken('')
    setDuration(0)
    setCliff(0)
    setUpfront(0)
    setSettings(null)
    setData(null)
  }, [])

  return (
    <WizardContext.Provider
      value={{
        step,
        onNext,
        onBack,
        token,
        onTokenChange,
        duration,
        onDurationChange,
        cliff,
        onCliffChange,
        upfront,
        onUpfrontChange,
        data,
        onDataChange,
        settings,
        onSettingsChange,
        partyAddress,
        onPartyAddressChange,
        resetData,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

WizardProvider.propTypes = {
  children: PropTypes.node,
}

function useWizard() {
  return useContext(WizardContext)
}

export { WizardProvider, useWizard }
