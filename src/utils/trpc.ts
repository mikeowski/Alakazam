import { createReactQueryHooks } from '@trpc/react'
import type { AppRouter } from '../pages/api/trpc/[trpc]'
import superjson from 'superjson'
export const trpc = createReactQueryHooks<AppRouter>({ transformer: superjson })
// => { useQuery: ..., useMutation: ...}
