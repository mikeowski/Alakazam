import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { useRef } from 'react'
import Link from 'next/link'
import CreatePoll from '../components/createPoll'
import LivePolls from '../components/livePolls'
const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['questions.get-all'])

  if (isLoading || !data) {
    return <div>Loading...</div>
  }
  return (
    <div className="container flex flex-col items-center justify-center px-20 ">
      <CreatePoll />
      <LivePolls />
    </div>
  )
}

export default Home
