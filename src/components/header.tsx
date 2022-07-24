import Link from 'next/link'

const Header = () => {
  return (
    <header className="w-full mx-auto text-6xl text-center pt-4">
      <Link href="/">
        <a href="">
          <h1 className="">Poller</h1>
        </a>
      </Link>
    </header>
  )
}

export default Header
