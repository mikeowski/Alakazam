import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

const Welcome: React.FC = () => {
  const { data: session } = useSession()
  return (
    <div className="flex gap-4 justify-center items-center mb-2">
      <h1 className="text-2xl sm:text-4xl ">Welcome {session?.user.name!}</h1>
      <Image
        src={session?.user.image!}
        width="50"
        height="50"
        layout="fixed"
        alt={session?.user.name!}
        className="rounded-xl"
      />
      <button
        className="hover:cursor-pointer px-4 py-2 col-span-2 form-input boxWithHover"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  )
}
export default Welcome
