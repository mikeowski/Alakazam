import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { useRef } from 'react'
import Header from '../components/header'
import Link from 'next/link'
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
    <div className="">
      <input
        disabled={isLoading}
        className="h-10 border rounded"
        onKeyDown={(event) => {
          if (event.key == 'Enter') {
            mutate({ question: event.currentTarget.value })
            event.currentTarget.value = ''
          }
        }}
      ></input>
    </div>
  )
}
const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['questions.get-all'])

  if (isLoading || !data) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex flex-col items-center justify-center max-h-screen px-20">
      <div className="flex flex-col ">
        <CreateQuestion />

        <div className="text-4xl font-bold text-center">Live Polls</div>
        {data.map((v) => (
          <Link key={v.id} href={`/question/${v.id}`}>
            <a>
              <div key={v.id}>{v.question}</div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
