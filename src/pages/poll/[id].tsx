import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'

const QuestionPage: NextPage = () => {
  const { query } = useRouter()
  const { id } = query
  if (!id || typeof id !== 'string') {
    return <div>Question ID is not found</div>
  }
  const { data, isLoading } = trpc.useQuery(['questions.get-from-id', { id }])

  if (!isLoading && !data) {
    return <div>Poll not found</div>
  }
  if (isLoading) {
    return <div>Loading..</div>
  }
  return (
    <div className="flex flex-col items-center container ">
      <div className={'bg-red-700 my-2 py-3 px-8 font-bold rounded-md'}>
        {data.isOwner ? <span>Owner</span> : <span>Voter</span>}
      </div>

      <h1 className="text-2xl md:text-4xl font-bold">{data.poll?.question}</h1>
      <div className="flex flex-wrap gap-2 w-full items-center justify-center mt-10">
        {(data.poll?.options as string[]).map((v) => (
          <button
            key={v}
            className="rounded-lg w-1/3 dark:border-gray-500 transition-all dark:hover:border-gray-300  text-center h-14 border"
          >
            {(v as any).text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuestionPage
