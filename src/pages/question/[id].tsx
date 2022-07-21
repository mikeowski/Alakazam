import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'

const QuestionPage = () => {
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
  return <div>Question {data?.question}</div>
}

export default QuestionPage
