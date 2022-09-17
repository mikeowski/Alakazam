import type { NextPage } from 'next'
import { useSession, signIn, signOut } from 'next-auth/react'
import CreatePoll from '../components/createPoll'
import LivePolls from '../components/livePolls'
import SingIn from '../components/signIn'

const Home: NextPage = () => {
  const { data: session } = useSession()
  return (
    <div className="container  px-20 ">
      <div>
        {session ? (
          <>
            <CreatePoll />
            <LivePolls />
          </>
        ) : (
          <>
            <SingIn />
          </>
        )}
      </div>
    </div>
  )
}

export default Home
