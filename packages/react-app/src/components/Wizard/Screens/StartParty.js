import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, GU } from '@1hive/1hive-ui'
import Header from '../Header'
import { useWizard } from '../../../providers/Wizard'
import TransactionStatus from '../../Transaction/TransactionStatus'
import {
  TX_STATUS_SIGNED,
  TX_STATUS_PENDING,
  TX_STATUS_CONFIRMED,
  TX_STATUS_SIGNATURE_FAILED,
  TX_STATUS_FAILED,
} from '../../Transaction/transaction-statuses'
import { useFactoryContract } from '../../../hooks/useContract'
import { writeAirtableData } from '../../../utils/airtable'
import { getNetwork } from '../../../networks'

const EMPTY_STATE = {
  signed: false,
  confirmed: false,
  errorSigning: false,
  failed: false,
}

function StartParty({ title }) {
  const [attempt, setAttempt] = useState(0)
  const [progress, setProgress] = useState(EMPTY_STATE)
  const [error, setError] = useState('')
  const { data, settings, onNext, onPartyAddressChange } = useWizard()

  const factory = useFactoryContract()

  const status = useMemo(() => {
    if (progress.errorSigning) {
      return TX_STATUS_SIGNATURE_FAILED
    }

    if (progress.failed) {
      return TX_STATUS_FAILED
    }

    if (progress.confirmed) {
      return TX_STATUS_CONFIRMED
    }

    if (progress.signed) {
      return TX_STATUS_SIGNED
    }

    return TX_STATUS_PENDING
  }, [progress])

  const handleNextAttempt = useCallback(() => {
    setAttempt((attempt) => attempt + 1)
  }, [])

  const signTx = useCallback(async () => {
    try {
      const tx = await factory.startParty(
        settings.token,
        settings.root,
        settings.upfront,
        settings.period,
        settings.duration,
        settings.cliff,
        { gasLimit: 9500000 }
      )
      setProgress((progress) => ({
        ...progress,
        signed: true,
      }))
      return tx
    } catch (err) {
      setError(err.message)
      setProgress((progress) => ({ ...progress, errorSigning: true }))
    }
  }, [])

  const ensureConfirmation = useCallback(
    async (signedTx) => {
      try {
        const recipt = await signedTx.wait()

        const { args } = recipt.logs
          .map((log) => factory.interface.parseLog(log))
          .find(({ name }) => name === 'NewParty')

        writeAirtableData(args[0], getNetwork().chainId, data)

        onPartyAddressChange(args[0])
        setProgress((progress) => ({ ...progress, confirmed: true }))
        onNext()
      } catch (err) {
        setProgress((progress) => ({ ...progress, failed: true }))
      }
    },
    [data, factory.interface, onNext, onPartyAddressChange]
  )

  useEffect(() => {
    if (progress.confirmed) {
      return
    }

    setProgress((progress) => ({
      ...progress,
      errorSigning: false,
      failed: false,
    }))

    const start = async () => {
      try {
        const signedTx = await signTx()
        await ensureConfirmation(signedTx)
      } catch (err) {
        console.error(err)
      }
    }

    start()
  }, [error, settings, attempt, ensureConfirmation, signTx, progress.confirmed])

  return (
    <div>
      <Header title={title} />
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <TransactionStatus status={status} error={error} />
        <div
          css={`
            margin-top: ${2 * GU}px;
            text-align: center;
          `}
        >
          {(status === TX_STATUS_FAILED ||
            status === TX_STATUS_SIGNATURE_FAILED) && (
            <Button label="Retry" mode="strong" onClick={handleNextAttempt} />
          )}
        </div>
      </div>
    </div>
  )
}

export default StartParty
