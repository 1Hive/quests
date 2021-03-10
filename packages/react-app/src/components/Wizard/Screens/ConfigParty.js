import React, { useCallback, useMemo, useRef } from 'react'
import { Field, GU, Info, TextInput, Slider } from '@1hive/1hive-ui'
import Header from '../Header'
import Navigation from '../Navigation'
import { useWizard } from '../../../providers/Wizard'
import { isAddress } from 'web3-utils'

function ConfigParty({ title }) {
  const {
    onNext,
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
  } = useWizard()

  const fileReader = useRef(null)

  const errors = useMemo(() => {
    const errors = []
    if (token && !isAddress(token)) {
      errors.push('Token must be a valid address')
    }
    if (duration !== 0 && cliff !== 0 && duration <= cliff) {
      errors.push('Vesting duration should be greater than cliff')
    }

    return errors
  }, [token, duration, cliff])

  const handleFileRead = useCallback(() => {
    const content = fileReader.current.result
    try {
      const parsedContent = JSON.parse(content)
      onDataChange(parsedContent)
    } catch (err) {
      console.error(`Failed uploading JSON file ${err}`)
    }
  }, [fileReader, onDataChange])

  const handleJsonFileSelected = useCallback(
    (event) => {
      fileReader.current = new FileReader()
      fileReader.current.onloadend = handleFileRead
      fileReader.current.readAsText(event.target.files[0])
    },
    [handleFileRead]
  )

  const emptyValues =
    (!token || !duration || !data) &&
    (!token || !(Math.round(100 * upfront) === 100))

  return (
    <div>
      <Header title={title} />
      <div>
        <div>Here you will decide all the details of your hosted party.</div>
        <div
          css={`
            margin-top: ${3 * GU}px;
          `}
        >
          <Field
            label="Token Address"
            css={`
              width: 100%;
            `}
          >
            <TextInput
              value={token}
              onChange={onTokenChange}
              wide
              placeholder="0xcafe"
            />
          </Field>
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <Field
              label="Vesting Duration"
              css={`
                width: 100%;
                margin-right: ${1.5 * GU}px;
              `}
            >
              <TextInput
                value={duration}
                onChange={onDurationChange}
                wide
                type="number"
              />
            </Field>
            Days
          </div>
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <Field
              label="Cliff Duration"
              css={`
                width: 100%;
                margin-right: ${1.5 * GU}px;
              `}
            >
              <TextInput
                value={cliff}
                onChange={onCliffChange}
                wide
                type="number"
                placeholder="0"
              />
            </Field>
            Days
          </div>
          <Field
            label="Upfront Token Amount (On %)"
            css={`
              width: 100%;
            `}
          >
            <Slider value={upfront} onUpdate={onUpfrontChange} />
            <span>{Math.round(100 * upfront)} %</span>
          </Field>
          <Field
            label="Json Data"
            css={`
              width: 100%;
              margin-right: ${1.5 * GU}px;
            `}
          >
            <TextInput
              onChange={handleJsonFileSelected}
              wide
              type="file"
              required
            />
          </Field>
        </div>
      </div>

      {errors.length > 0 && (
        <Info
          mode="warning"
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          {errors.map((error, index) => {
            return <div key={index}>{error}</div>
          })}
        </Info>
      )}
      <Navigation
        nextEnabled={!emptyValues && errors.length === 0}
        onNext={onNext}
        showBack={false}
      />
    </div>
  )
}

export default ConfigParty
