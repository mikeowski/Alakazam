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
    input: z.object({ userId: z.string() }),
    async resolve({ input }) {
      if (!input.userId) return []
      return await prisma.question.findMany({
        where: { userId: input.userId },
      })
    },
  })
  .query('get-from-id', {
    input: z.object({ questionId: z.string(), userId: z.string() }),
    async resolve({ input }) {
      const pollData = await prisma.question.findUnique({
        where: {
          id: input.questionId,
        },
      })

      const myVoteData = await prisma.vote.findFirst({
        where: {
          questionId: { equals: input.questionId },
          userId: { equals: input.userId },
        },
      })

      const votes =
        myVoteData || pollData?.userId === input.userId
          ? await prisma.vote.groupBy({
              by: ['choice'],
              where: {
                questionId: { equals: input.questionId },
              },
              _count: true,
            })
          : []
      return {
        poll: pollData,
        isOwner: pollData?.userId === input.userId,
        myVote: myVoteData,
        votes,
      }
    },
  })
  .mutation('create', {
    input: z.object({ question: createQuestionValidator, userId: z.string() }),
    async resolve({ input }) {
      if (!input.userId) throw new Error('unauthorized')
      return await prisma.question.create({
        data: {
          question: input.question.question,
          options: input.question.options,
          userId: input.userId,
          isPublic: input.question.isPublic,
        },
      })
    },
  })
  .mutation('vote', {
    input: z.object({
      questionId: z.string(),
      optionIndex: z.number().min(0).max(19),
      userId: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!input.userId) throw new Error('unauthorized')
      return await prisma.vote.create({
        data: {
          userId: input.userId,
          questionId: input.questionId,
          choice: input.optionIndex,
        },
      })
    },
  })
  .mutation('deleteQuesiton', {
    input: z.object({
      questionId: z.string(),
    }),
    async resolve({ input }) {
      await prisma.vote.deleteMany({ where: { questionId: input.questionId } })
      await prisma.question.delete({ where: { id: input.questionId } })
    },
  })
