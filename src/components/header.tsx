import Link from 'next/link'

const Header = () => {
  return (
    <header className="w-full mx-auto text-6xl text-center">
      <Link href="/">
        <a href="">
          <h1 className="">Poll</h1>
        </a>
      </Link>
    </header>
  )
}

export default Header
