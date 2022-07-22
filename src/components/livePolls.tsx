import Link from 'next/link'
import { trpc } from '../utils/trpc'

const LivePolls: React.FC = () => {
  const { data, isLoading } = trpc.useQuery(['questions.get-all-my-quesitons'])

  return (
    <div className="flex flex-col justify-center mt-20">
      <div>
        {!isLoading && (!data || data.length == 0) ? (
          <h2 className="text-4xl text-center">Your dont have a poll yet</h2>
        ) : (
          <div>
            <h2 className="text-4xl text-center mb-2">Your Live Polls</h2>
            {data?.map((v) => (
              <Link key={v.id} href={`poll/${v.id}`}>
                <a>
                  <div className="border px-4 py-2 rounded-lg mb-3 dark:border-gray-500 hover:translate-x-1 transition-all">
                    {v.question}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LivePolls
