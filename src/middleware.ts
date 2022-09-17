export { default } from 'next-auth/middleware'
// This function can be marked `async` if using `await` inside
// See "Matching Paths" below to learn more
export const config = { matcher: ['/poll/:path*'] }
