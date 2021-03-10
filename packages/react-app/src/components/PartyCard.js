import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'
import partySvg from '../assets/party.svg'
// import { useWallet } from '../providers/Wallet'
// import { useUserClaimData } from '../hooks/useUserClaim'

function PartyCard({ party }) {
  const theme = useTheme()
  const history = useHistory()
  // const { account } = useWallet()

  // const claimInfo = useUserClaimData(account, party.id)

  const handleSelect = useCallback(() => {
    history.push(`/party/${party.id}`)
  }, [history, party.id])

  const vestedTokens = useMemo(() => {
    return party.vestings.reduce((acc, vesting) => {
      return acc.plus(vesting.amount)
    }, BigInt('0'))
  }, [party.vestings])

  return (
    <div
      css={`
        padding: ${5 * GU}px;
        border: 1px solid ${theme.border};
        background: white;
        border-radius: 10px;

        cursor: pointer;
        transition: box-shadow 0.4s ease;

        &:hover {
          box-shadow: 0px 1px 2px 0px rgb(0, 0, 0, 0.2);
        }
      `}
      onClick={handleSelect}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <img src={partySvg} alt="" height="40" />
        <div
          css={`
            margin-left: ${2 * GU}px;
            ${textStyle('title3')};
          `}
        >
          {party.name}
        </div>
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <label
          css={`
            color: ${theme.contentSecondary};
            margin-bottom: ${2 * GU}px;
          `}
        >
          Vested tokens:
        </label>
        <div
          css={`
            ${textStyle('title3')};
          `}
        >
          {vestedTokens.toString()}
        </div>
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <label
          css={`
            color: ${theme.contentSecondary};
            margin-bottom: ${2 * GU}px;
          `}
        >
          Deposited tokens:
        </label>
        <div
          css={`
            ${textStyle('body2')};
          `}
        >
          0
        </div>
      </div>
    </div>
  )
}

export default PartyCard
