import NextAuth, { NextAuthOptions, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid as string
      }
      return session
    },
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENTID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENTSEC!,
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)
