import { useUserSubscription } from './useSubscriptions'

export default function useUser(account) {
  const { user, fetching } = useUserSubscription(account)

  return [user, fetching]
}
