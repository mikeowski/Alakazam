import { useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { trpc } from '../utils/trpc'

type Inputs = {
  question: string
}

const CreatePoll = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {}
  const { mutate, isLoading } = trpc.useMutation('questions.create', {
    onSuccess: () => {},
  })
  return (
    <div className="flex flex-col sm:w-3/5 w-full">
      <h2 className="md:text-4xl text-2xl text-center mb-4">Create New Poll</h2>
      <div className="flex items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full outline-none">
          <div className="grid grid-cols-2 space-y-2">
            <label className="block col-span-2 text-lg">
              <span className="dark:text-gray-200">Question</span>
              <input
                type="text"
                className="mt-1 block w-full  px-2 py-1 col-span-2 rounded-md border border-gray-600 hover:border-gray-400 dark:bg-gray-700  transition-all"
                placeholder="Is the earth flat?"
                {...register('question', { required: true })}
              />
            </label>{' '}
            <input
              type="submit"
              value="Create a poll"
              className="form-input dark:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-400 transition-all dark:text-gray-200"
            />
          </div>
          {errors.exampleRequired && <span>This field is required</span>}
        </form>
      </div>
      <div className="flex flex-wrap"></div>
    </div>
  )
}

export default CreatePoll
