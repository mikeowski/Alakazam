import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  console.log(req.cookies.get('poll-token'))
  if (req.cookies.has('poll-token')) return
  const res = NextResponse.next()
  const random = nanoid()
  res.cookies.set('poll-token', random, { sameSite: 'strict' })
  return res
}
