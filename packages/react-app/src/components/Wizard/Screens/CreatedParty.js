import React from 'react'
import { AddressField, GU } from '@1hive/1hive-ui'
import { useWizard } from '../../../providers/Wizard'
import Header from '../Header'

function CreatedParty({ title }) {
  const { partyAddress } = useWizard()
  return (
    <div>
      <Header title={title} />
      <div
        css={`
          text-align: center;
        `}
      >
        <div
          css={`
            margin-top: ${3 * GU}px;
            margin-bottom: ${2 * GU}px;
          `}
        >
          <AddressField address={partyAddress} />
        </div>
        This is the address where you will deposit the tokens to distribute.
      </div>
    </div>
  )
}

export default CreatedParty
