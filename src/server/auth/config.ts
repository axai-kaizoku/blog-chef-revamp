import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { type DefaultSession, type NextAuthConfig } from "next-auth"

import { db } from "@/server/db"
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema"
import Google from "next-auth/providers/google"
import { env } from "@/env"
import { sql } from "drizzle-orm"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      role: UserRole
    } & DefaultSession["user"]
  }

  // interface User {
  // ...other properties
  // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "database",
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    // session: ({ session, user, token }) => {
    //   console.log(session, "session session"); // 4th coming
    //   console.log(user, "user session"); // 5th not coming
    //   console.log(token, "token  session"); // 6th coming
    //   return session;
    // },
    jwt: async ({ token, session }) => {
      const userCheck = await db
        .select()
        .from(users)
        .where(sql`${users.email} = ${token.email}`)
      const dbUser = userCheck[0]
      console.log(dbUser, "jwt token") // 1st coming

      if (!dbUser) {
        console.log("No User")
        // throw new Error("Unable to find user");
      }

      console.log(token, "jwt token") // 2nd coming
      console.log(session, "jwt session") // 3rd not coming
      return token
    },
  },
} satisfies NextAuthConfig
