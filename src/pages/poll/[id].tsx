import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'

const QuestionPage: NextPage = () => {
  const { query } = useRouter()
  const { id } = query
  if (!id || typeof id !== 'string') {
    return <div>Question ID is not found</div>
  }
  const client = trpc.useContext()
  const { data, isLoading } = trpc.useQuery(['questions.get-from-id', { id }])
  const { mutate, data: voteResponse } = trpc.useMutation('questions.vote', {
    onSuccess: () => {
      client.invalidateQueries(['questions.get-from-id', { id }])
    },
  })
  if (!isLoading && !data) {
    return <div>Poll not found</div>
  }
  if (isLoading) {
    return <div>Loading..</div>
  }
  return (
    <div className="flex flex-col items-center container ">
      <div
        className={
          'my-2 py-3 px-8 font-bold rounded-md ' +
          (data.isOwner ? 'bg-red-700' : 'bg-green-700')
        }
      >
        {data.isOwner ? <span>Owner</span> : <span>Voter</span>}
      </div>
      <h1 className="text-2xl md:text-4xl font-bold">{data.poll?.question}</h1>

      <div className="flex flex-wrap gap-2 w-full items-center justify-center mt-10">
        {(data.poll?.options as string[]).map((option, index) => (
          <button
            key={index}
            className={`rounded-lg w-1/3 text-center h-14  ${
              data.myVote?.choice == index
                ? 'ring ring-green-500'
                : 'boxWithHover'
            }`}
            onClick={() => {
              mutate({ questionId: data.poll?.id, optionIndex: index })
            }}
            disabled={data.myVote != null}
          >
            {(option as any).text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuestionPage
