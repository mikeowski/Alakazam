import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'

const CreateQuestion: React.FC = () => {
  const { mutate } = trpc.useMutation('questions.create')

  return (
    <input
      onSubmit={(event) => {
        console.log(event.currentTarget.value)
      }}
    ></input>
  )
}
const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['questions.get-all'])

  if (isLoading || !data) {
    return <div>Loading...</div>
  }
  console.log(data)
  return (
    <div>
      <div className="flex flex-col ">
        <div className="text-4xl font-bold">Questions</div>
        <div>{data[0].question}</div>
      </div>
      <CreateQuestion />
    </div>
  )
}

export default Home
