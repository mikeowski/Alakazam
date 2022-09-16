import Link from 'next/link'
import { trpc } from '../utils/trpc'
import { useSession } from 'next-auth/react'

const LivePolls: React.FC = () => {
  const { data: session } = useSession()
  const { data, isLoading } = trpc.useQuery([
    'questions.get-all-my-quesitons',
    { userId: session?.user.id! },
  ])
  const { data: publicPolls, isLoading: publicIsloading } = trpc.useQuery([
    'questions.get-all-public-questions',
  ])
  return (
    <div className="flex flex-col sm:flex-row mt-20 justify-evenly w-full">
      <div>
        {!isLoading && (!data || data.length == 0) ? (
          <h2 className="text-2xl text-center">Your dont have a poll yet</h2>
        ) : (
          <div>
            <h2 className="text-2xl text-center mb-2">Your Live Polls</h2>
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
      <hr className="border border-top-2 w-full sm:hidden my-4" />
      <div>
        {!publicIsloading && (!publicPolls || publicPolls.length == 0) ? (
          <h2 className="text-2xl text-center">No public polls found</h2>
        ) : (
          <div>
            <h2 className="text-2xl text-center mb-2">Public Polls</h2>
            {publicPolls?.map((v) => (
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
