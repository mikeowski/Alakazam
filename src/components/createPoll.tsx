import { useRef } from 'react'
import { trpc } from '../utils/trpc'
const CreatePoll: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const client = trpc.useContext()
  const { mutate, isLoading } = trpc.useMutation('questions.create', {
    onSuccess: () => {
      client.invalidateQueries(['questions.get-all'])
      if (!inputRef.current) return
      inputRef.current.value = ''
    },
  })

  return (
    <div className="flex flex-col">
      <h2 className="text-4xl text-center mb-4">Create New Poll</h2>
      <div className="flex items-center gap-3">
        <span className="text-lg">Question: </span>
        <input
          disabled={isLoading}
          className="h-10 border dark:border-gray-500 focus:border-gray-400 rounded-lg focus:outline-0 px-4 py-2 dark:bg-gray-700"
          onKeyDown={(event) => {
            if (event.key == 'Enter') {
              mutate({ question: event.currentTarget.value })
              event.currentTarget.value = ''
            }
          }}
          placeholder="Is the earth flat?"
        ></input>
      </div>
      <div className="flex flex-wrap"></div>
    </div>
  )
}

export default CreatePoll
