import type { NextPage } from 'next'
import { useSession, signIn, signOut } from 'next-auth/react'
import CreatePoll from '../components/createPoll'
import LivePolls from '../components/livePolls'
import SingIn from '../components/signIn'
import Welcome from '../components/welcome'
const Home: NextPage = () => {
  const { data: session } = useSession()
  return (
    <div className="container flex flex-col items-center justify-center px-20 ">
      <div>
        {session ? (
          <>
            <Welcome />
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
