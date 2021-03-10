import React, { useCallback } from 'react'
import { Field, GU, TextInput } from '@1hive/1hive-ui'
import Header from '../Header'
import Navigation from '../Navigation'
import BalanceTree from '../../../utils/balance-tree'
import { useWizard } from '../../../providers/Wizard'
import { PCT_BASE } from '../../../constants'

function ConfirmParty({ title }) {
  const {
    onNext,
    onBack,
    token,
    duration,
    cliff,
    upfront,
    data,
    onSettingsChange,
  } = useWizard()

  const handleStartParty = useCallback(() => {
    const tree = new BalanceTree(data)

    onSettingsChange({
      token: token,
      root: tree.getHexRoot(),
      upfront: (BigInt(Math.round(100 * upfront)) * PCT_BASE) / BigInt(100),
      period: 0,
      duration: duration,
      cliff: cliff,
    })
    onNext()
  }, [onNext, token, duration, cliff, upfront, data, onSettingsChange])

  return (
    <div>
      <Header title={title} />
      <div>
        <div>
          Here you will review the details of your party and sent a transaction
          to start it.
        </div>
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
            {token}
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
              {duration} Days
            </Field>
          </div>
          <Field
            label="Cliff Duration"
            css={`
              width: 100%;
            `}
          >
            <span>{cliff} Days</span>
          </Field>
          <Field
            label="Upfront Token Amount"
            css={`
              width: 100%;
            `}
          >
            <span>{Math.round(100 * upfront)} %</span>
          </Field>
          <Field
            label="Balances"
            css={`
              width: 100%;
            `}
          >
            <TextInput
              multiline
              disabled
              wide
              css={`
                height: 180px;
              `}
            >
              {JSON.stringify(data, 0, 2)}
            </TextInput>
          </Field>
        </div>
      </div>
      <Navigation
        nextLabel="Start Party!"
        onNext={handleStartParty}
        onBack={onBack}
      />
    </div>
  )
}

export default ConfirmParty
