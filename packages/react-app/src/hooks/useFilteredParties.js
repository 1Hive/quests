import { addressesEqual } from '@1hive/1hive-ui'
import { useCallback, useMemo, useState } from 'react'
import { useParties } from './useParties'
import { useWallet } from '../providers/Wallet'

const NULL_FILTER_STATE = -1
const HOST_FILTER_YOU = 1
const HOST_FILTER_OTHERS = 2

function testHostFilter(filter, host, account) {
  return (
    filter === NULL_FILTER_STATE ||
    (filter === HOST_FILTER_YOU && addressesEqual(host, account)) ||
    (filter === HOST_FILTER_OTHERS && !addressesEqual(host, account))
  )
}

function useFilteredParties() {
  const { account } = useWallet()
  const [parties, loading] = useParties()
  const [creatorFilter, setCreatorFilter] = useState(NULL_FILTER_STATE)

  const filteredParties = useMemo(
    () =>
      parties.filter((party) => {
        return testHostFilter(creatorFilter, party.host, account)
      }),
    [account, creatorFilter, parties]
  )

  return {
    filteredParties,
    filters: {
      host: {
        items: ['All', 'You', 'Others'],
        filter: creatorFilter,
        onChange: useCallback(
          (index) => setCreatorFilter(index || NULL_FILTER_STATE),
          [setCreatorFilter]
        ),
      },
    },
    loading,
  }
}

export default useFilteredParties
