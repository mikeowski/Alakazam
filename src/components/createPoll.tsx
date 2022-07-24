import { useRef } from 'react'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
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
    control,
  } = useForm<createQuestionValidatorType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      options: [{ text: 'Yes' }, { text: 'No' }],
    },
  })
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'options', // unique name for your Field Array
    }
  )
  const client = trpc.useContext()
  const router = useRouter()

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
        <form
          onSubmit={handleSubmit((data) => {
            mutate(data)
          })}
          className="w-full outline-none"
        >
          <div className="grid grid-cols-2 gap-2">
            <label className="block col-span-2 text-lg">
              <span className="dark:text-gray-200 font-bold">Question</span>
              <input
                type="text"
                className="mt-1 block w-full  px-2 py-1 col-span-2 rounded-md border border-gray-600 hover:border-gray-400 dark:bg-gray-700  transition-all"
                placeholder="Is the earth flat?"
                {...register('question', { required: true })}
              />
            </label>{' '}
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="px-2 py-2 rounded-md border bg-gray-700 border-gray-600 hover:border-gray-400 "
                >
                  <section className={'section'} key={field.id}>
                    <input
                      placeholder="option"
                      {...register(`options.${index}.text`, {
                        required: true,
                      })}
                      className="dark:bg-gray-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="hover:underline"
                    >
                      DELETE
                    </button>
                  </section>
                </div>
              )
            })}
            <div className="col-span-2 form-input dark:bg-gray-700 rounded-lg border text-center border-gray-600 hover:border-gray-400 transition-all dark:text-gray-200 ">
              <button
                type="button"
                value="add mode options"
                onClick={() => append({ text: '' })}
              >
                Add option
              </button>
            </div>
            <input
              type="submit"
              value="Create a poll"
              className="col-span-2 form-input dark:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-400 transition-all dark:text-gray-200"
            />
            {errors.question && (
              <span className="dark:text-red-500 text-red-600">
                {errors.question.message}
              </span>
            )}{' '}
            {errors.options && (
              <span className="dark:text-red-500 text-red-600">
                {errors.options.message}
              </span>
            )}
          </div>
        </form>
      </div>
      <div className="flex flex-wrap"></div>
    </div>
  )
}

export default CreatePoll
