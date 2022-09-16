import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const { data: session } = useSession()
  return (
    <header className="w-full mx-auto  text-center px-12 pt-4 flex justify-between">
      <Link href="/">
        <a href="" className="text-6xl">
          <h1>Alakazam</h1>
        </a>
      </Link>
      {session ? (
        <div className="flex justify-center items-center gap-4 text-xl">
          <div className="flex flex-col">
            <span>{session.user.name}</span>
            <button
              className="hover:cursor-pointer py-1 col-span-2 form-input boxWithHover"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
          <Image
            src={session.user.image!}
            width="56"
            height="56"
            alt={session.user.name!}
            className="rounded-lg"
          />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-lg border border-gray-300"></div>
      )}
    </header>
  )
}

export default Header
