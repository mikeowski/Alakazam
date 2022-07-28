import * as trpc from '@trpc/server'
import { z } from 'zod'
import { prisma } from '../../db/client'
import { createQuestionValidator } from '../../shared/create-question-validator'
import { createRouter } from './context'

export const QuestionRouter = createRouter()
  .query('get-all-public-questions', {
    async resolve() {
      return await prisma.question.findMany({ where: { isPublic: true } })
    },
  })
  .query('get-all-my-quesitons', {
    async resolve({ ctx }) {
      if (!ctx.token) return []
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

      const myVoteData = await prisma.vote.findFirst({
        where: {
          questionId: { equals: input.id },
          voterToken: { equals: ctx.token },
        },
      })

      const votes =
        pollData?.ownerToken === ctx.token || myVoteData
          ? await prisma.vote.groupBy({
              by: ['choice'],
              where: {
                questionId: { equals: input.id },
              },
              _count: true,
            })
          : []
      return {
        poll: pollData,
        isOwner: pollData?.ownerToken === ctx.token,
        myVote: myVoteData,
        votes,
      }
    },
  })
  .mutation('create', {
    input: createQuestionValidator,
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error('unauthorized')
      return await prisma.question.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.token,
          isPublic: input.isPublic,
        },
      })
    },
  })
  .mutation('vote', {
    input: z.object({
      questionId: z.string(),
      optionIndex: z.number().min(0).max(19),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error('unauthorized')
      return await prisma.vote.create({
        data: {
          voterToken: ctx.token,
          questionId: input.questionId,
          choice: input.optionIndex,
        },
      })
    },
  })
