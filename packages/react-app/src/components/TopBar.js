import React, { useState } from 'react'
import { Bar, Button, GU } from '@1hive/1hive-ui'
import Filters from './Filters'
import { useWallet } from '../providers/Wallet'
import Wizard from './Wizard/Wizard'

function TopBar({ filters }) {
  const [opened, setOpened] = useState(false)
  const { account } = useWallet()

  const open = () => {
    setOpened(true)
  }
  const close = () => setOpened(false)

  return (
    <Bar>
      <div
        css={`
          display: flex;
          algin-items: center;
          justify-content: space-between;
          padding: ${1.5 * GU}px;
        `}
      >
        {account ? <Filters filters={filters} /> : <div />}
        {account ? (
          <Button label="Create party!" mode="strong" onClick={open} />
        ) : (
          <div />
        )}
      </div>
      <Wizard opened={opened} close={close} />
    </Bar>
  )
}

export default TopBar
