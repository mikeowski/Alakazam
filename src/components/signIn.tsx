import { signIn } from 'next-auth/react'

const SingIn: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-12">
      <h1 className="text-4xl font-bold">Sign In</h1>
      <button
        className="hover:cursor-pointer px-4 py-2 col-span-2 form-input boxWithHover"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    </div>
  )
}

export default SingIn
