import * as trpc from '@trpc/server'
import { z } from 'zod'
import { prisma } from '../../db/client'
import { createRouter } from './context'

export const QuestionRouter = createRouter()
  .query('get-all', {
    async resolve() {
      return await prisma.question.findMany()
    },
  })
  .query('get-all-my-quesitons', {
    async resolve({ ctx }) {
      return await prisma.question.findMany({
        where: { ownerToken: { equals: ctx.token } },
      })
    },
  })
  .query('get-from-id', {
    input: z.object({ id: z.string() }),
    async resolve({ input, ctx }) {
      const pollData = await prisma.question.findUnique({
        where: {
          id: input.id,
        },
      })
      return { poll: pollData, isOwner: pollData?.ownerToken === ctx.token }
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string().min(5).max(900),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) return { error: 'Unauthorized' }
      return await prisma.question.create({
        data: {
          question: input.question,
          options: [],
          ownerToken: ctx.token,
        },
      })
    },
  })
