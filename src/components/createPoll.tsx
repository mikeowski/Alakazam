import { useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { trpc } from '../utils/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createQuestionValidator,
  createQuestionValidatorType,
} from '../shared/create-question-validator'
import { useRouter } from 'next/router'

const CreatePoll = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<createQuestionValidatorType>({
    resolver: zodResolver(createQuestionValidator),
  })
  const client = trpc.useContext()
  const router = useRouter()
  const onSubmit: SubmitHandler<createQuestionValidatorType> = (data) => {
    mutate({ question: data.question })
  }
  const { mutate, isLoading, data } = trpc.useMutation('questions.create', {
    onSuccess: (data) => {
      router.push(`/poll/${data.id}`)
    },
  })
  if (isLoading || data) return <div className="text-center">Loading...</div>
  return (
    <div className="flex flex-col sm:w-3/5 w-full">
      <h2 className="md:text-4xl text-2xl text-center mb-4 font-extrabold">
        Create New Poll
      </h2>
      <div className="flex items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full outline-none">
          <div className="grid grid-cols-2 space-y-2">
            <label className="block col-span-2 text-lg">
              <span className="dark:text-gray-200 font-bold">Question</span>
              <input
                type="text"
                className="mt-1 block w-full  px-2 py-1 col-span-2 rounded-md border border-gray-600 hover:border-gray-400 dark:bg-gray-700  transition-all"
                placeholder="Is the earth flat?"
                {...register('question', { required: true })}
              />
              {errors.question && (
                <span className="dark:text-red-500 text-red-600">
                  {errors.question.message}
                </span>
              )}
            </label>{' '}
            <input
              type="submit"
              value="Create a poll"
              className="form-input dark:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-400 transition-all dark:text-gray-200"
            />
          </div>
        </form>
      </div>
      <div className="flex flex-wrap"></div>
    </div>
  )
}

export default CreatePoll
