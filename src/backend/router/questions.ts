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
  .query('get-from-id', {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      return await prisma.question.findUnique({
        where: {
          id: input.id,
        },
      })
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string().min(5).max(900),
    }),
    async resolve({ input }) {
      return await prisma.question.create({
        data: {
          question: input.question,
          options: [],
        },
      })
    },
  })
