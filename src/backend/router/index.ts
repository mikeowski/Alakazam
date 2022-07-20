import * as trpc from '@trpc/server'
import { z } from 'zod'
import superjson from 'superjson'
import { prisma } from '../../db/client'
import { QuestionRouter } from './questions'
export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge('questions.', QuestionRouter)
// export type definition of API
export type AppRouter = typeof appRouter
