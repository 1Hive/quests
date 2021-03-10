import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  AddressField,
  BackButton,
  Box,
  GU,
  LoadingRing,
  Tabs,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useParty } from '../hooks/useParties'
import { durationTime } from '../utils/date-utils'
import { PCT_BASE } from '../constants'

function Party({ match }) {
  const [selectedTab, setSelectedTab] = useState(0)
  const history = useHistory()
  const { id: partyId } = match.params

  const [party, loading] = useParty(partyId)

  const handleBack = useCallback(() => {
    history.push('/parties')
  }, [history])

  if (!party && !loading) {
    handleBack()
  }

  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
      `}
    >
      <BackButton
        onClick={handleBack}
        css={`
          background: transparent;
          border: 0;
          padding: 0;
          margin-bottom: ${3 * GU}px;
        `}
      />
      {loading ? (
        <LoadingRing />
      ) : (
        <Box padding={0}>
          <div
            css={`
              ${textStyle('title2')};
              padding: ${3 * GU}px;
            `}
          >
            {party.name}
          </div>
          <div
            css={`
              & > div {
                border-top: 0;
                border-left: 0;
                border-right: 0;

                border-radius: 0;
              }
            `}
          >
            <Tabs
              items={['Details', 'Deposit tokens']}
              selected={selectedTab}
              onChange={setSelectedTab}
            />
            {selectedTab === 0 ? (
              <Details party={party} />
            ) : (
              <DepositTokens party={party} />
            )}
          </div>
        </Box>
      )}
    </div>
  )
}

function Details({ party }) {
  return (
    <div
      css={`
        padding: ${5 * GU}px;
      `}
    >
      <div>
        <h2
          css={`
            ${textStyle('title4')}
          `}
        >
          Token info and assets
        </h2>

        <Field
          label="Token address"
          value={
            <div>
              <AddressField address={party.token.id} />
            </div>
          }
        />
        <Field label="Name" value={party.name} />
      </div>
      <LineSeparator />
      <div>
        <h2
          css={`
            ${textStyle('title4')}
          `}
        >
          Distribution details
        </h2>

        <Field
          label="Vesting duration"
          value={durationTime(
            party.vestingPeriod * party.vestingDurationInPeriods
          )}
        />
        <Field
          label=" Vesting cliff"
          value={durationTime(
            party.vestingPeriod * party.vestingCliffInPeriods
          )}
        />
        <Field
          label="Up front amount"
          value={`${(party.upfrontPct * BigInt(100)) / PCT_BASE}%`}
        />
      </div>
    </div>
  )
}

function DepositTokens({ party }) {
  return (
    <div
      css={`
        padding: ${5 * GU}px;
      `}
    >
      <div
        css={`
          ${textStyle('title4')};
        `}
      >
        In order to activate this offer, you need to deposit tokens in this
        address:
      </div>

      <Field
        label="Deposit address"
        value={<AddressField address={party.id} />}
      />
    </div>
  )
}

function LineSeparator() {
  const theme = useTheme()
  return (
    <div
      css={`
        margin: ${3 * GU}px 0;
        border-top: 1px solid ${theme.border};
      `}
    />
  )
}

function Field({ value, label }) {
  const theme = useTheme()

  return (
    <div
      css={`
        margin-top: ${3 * GU}px;
      `}
    >
      <label
        css={`
          ${textStyle('label2')};
          color: ${theme.contentSecondary};
        `}
      >
        {label}
      </label>
      <div
        css={`
          margin-top: ${0.5 * GU}px;
        `}
      >
        {value}
      </div>
    </div>
  )
}
export default Party
