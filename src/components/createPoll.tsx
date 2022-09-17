import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { trpc } from '../utils/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createQuestionValidator,
  createQuestionValidatorType,
} from '../shared/create-question-validator'
import { useRouter } from 'next/router'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
      isPublic: false,
    },
  })
  const [animate] = useAutoAnimate<HTMLDivElement>()
  const [isOn, setIsOn] = useState<boolean>(false)
  const toggleSwitch = () => setIsOn(!isOn)
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'options', // unique name for your Field Array
    }
  )
  const { data: session } = useSession()
  const client = trpc.useContext()
  const router = useRouter()

  const { mutate, isLoading, data } = trpc.useMutation('questions.create', {
    onSuccess: (data) => {
      router.push(`/poll/${data.id}`)
    },
  })

  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  }

  if (isLoading || data)
    return (
      <div className="m-48 text-center text-4xl animate-pulse">Loading..</div>
    )

  return (
    <div className="flex flex-col w-full">
      <h2 className="md:text-4xl text-2xl text-center mb-4 font-extrabold">
        Create New Poll
      </h2>
      <div>
        <form
          onSubmit={handleSubmit((data) => {
            mutate({
              question: { ...data, isPublic: isOn },
              userId: session?.user.id!,
            })
          })}
          className="w-full outline-none"
        >
          <div className="grid grid-cols-3 gap-2">
            <label className="block col-span-3 text-lg">
              <span className="dark:text-gray-200 font-bold">Question</span>
              <input
                type="text"
                className="mt-1 block w-full  px-2 py-2 col-span-2  boxWithHover focus:outline-none"
                placeholder="Is the earth flat?"
                {...register('question', { required: true })}
              />
            </label>{' '}
            <span className="col-span-3 font-bold dark:text-gray-200">
              Options
            </span>
            <div
              className="grid grid-cols-2 w-full col-span-3 gap-2"
              ref={animate}
            >
              {fields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className="col-span-3 lg:col-span-1 px-4 py-2 h-10 boxWithHover"
                  >
                    <section className={'flex justify-between'} key={field.id}>
                      <input
                        placeholder={`option ${index + 1}`}
                        {...register(`options.${index}.text`, {
                          required: true,
                        })}
                        className="dark:bg-gray-700 focus:outline-none w-full"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="hover:underline "
                        disabled={fields.length === 2}
                      >
                        DELETE
                      </button>
                    </section>
                  </div>
                )
              })}
            </div>
            <div className="col-span-3 grid grid-cols-6 gap-4">
              {' '}
              <button
                type="button"
                value="add mode options"
                onClick={() => append({ text: '' })}
                className="form-input px-4 py-2 boxWithHover text-center sm:col-span-4 col-span-4 "
              >
                Add option
              </button>
              <label className="flex items-center justify-between w-full sm:col-span-2 col-span-2">
                <span className="sm:text-lg">Public</span>
                <div className="switch" data-ison={isOn} onClick={toggleSwitch}>
                  <motion.div className="handle" layout transition={spring} />
                </div>
              </label>
            </div>
            <input
              type="submit"
              value="Create a poll"
              className="hover:cursor-pointer px-4 py-2 col-span-3 form-input boxWithHover"
            />
            {errors.question && (
              <span className="dark:text-red-500 text-red-600">
                {errors.question.message}
              </span>
            )}
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
