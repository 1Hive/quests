import {
  usePartySubscription,
  usePartiesSubscription,
} from './useSubscriptions'

export function useParties() {
  const { parties, fetching } = usePartiesSubscription()

  return [parties, fetching]
}

export function useParty(id) {
  const { party, fetching } = usePartySubscription(id)

  return [party, fetching]
}
