import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { useRef } from 'react'
const CreateQuestion: React.FC = () => {
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
    <input
      disabled={isLoading}
      onKeyDown={(event) => {
        if (event.key == 'Enter') {
          mutate({ question: event.currentTarget.value })
          event.currentTarget.value = ''
        }
      }}
    ></input>
  )
}
const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['questions.get-all'])

  if (isLoading || !data) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex flex-col px-20">
      <div className="flex flex-col ">
        <div className="text-4xl font-bold">Questions</div>
        {data.map((v) => (
          <div key={v.id}>{v.question}</div>
        ))}
      </div>
      <CreateQuestion />
    </div>
  )
}

export default Home
