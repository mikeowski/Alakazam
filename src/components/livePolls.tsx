import Link from 'next/link'
import { trpc } from '../utils/trpc'

const LivePolls: React.FC = () => {
  const { data, isLoading } = trpc.useQuery(['questions.get-all'])

  return (
    <div className="flex flex-col justify-center mt-20">
      <h2 className="text-4xl text-center">Live Polls</h2>
      <div className="mt-2">
        {!isLoading && !data ? (
          <div>No polls found</div>
        ) : (
          data?.map((v) => (
            <Link key={v.id} href={`poll/${v.id}`}>
              <a>
                <div className="border px-4 py-2 rounded-lg mb-3 dark:border-gray-500 hover:translate-x-1 transition-all">
                  {v.question}
                </div>
              </a>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default LivePolls
