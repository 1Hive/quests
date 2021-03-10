import React, { useEffect } from 'react'
import { Box, DataView, GU } from '@1hive/1hive-ui'
import { useWallet } from '../providers/Wallet'
import { useHistory } from 'react-router-dom'
import useUser from '../hooks/useUser'

function MyTokens() {
  const { account } = useWallet()
  const history = useHistory()

  const [user, loading] = useUser(account || '')

  useEffect(() => {
    if (!account) {
      history.push('/parties')
    }
  }, [account, history])

  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
        display: flex;
        column-gap: ${3 * GU}px;
      `}
    >
      <div
        css={`
          flex-basis: 25%;
        `}
      >
        <Box>Total value vested</Box>
        <Box>Total value claimed</Box>
      </div>
      <div
        css={`
          width: 100%;
        `}
      >
        <DataView
          css={`
            width: 100%;
          `}
          fields={['Token', 'Claimed amount', 'price', 'Vested amount']}
          entries={
            user?.claims.map((claim) => {
              return {
                token: claim.vesting.party.token.name,
                claimedAmount: claim.amount,
                vestedAmount: claim.vesting.amount,
              }
            }) || []
          }
          renderEntry={({ token, claimedAmount, price, vestedAmount }) => [
            <span>{token}</span>,
            <span>{claimedAmount}</span>,
            <span>{price}</span>,
            <span>{vestedAmount}</span>,
          ]}
          statusLoadinng={loading}
        />
      </div>
    </div>
  )
}

export default MyTokens
