import { z } from 'zod'

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(900),
})

export type createQuestionValidatorType = z.infer<
  typeof createQuestionValidator
>
