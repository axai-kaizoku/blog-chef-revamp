import { z } from "zod"
import bcrypt from "bcryptjs"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"
import { users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"

export const userRouter = createTRPCRouter({
  checkUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (usr, { eq }) => eq(usr.email, input.email),
      })

      if (user) {
        return true
      }
      return false
    }),

  createUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPass = await bcrypt.hash(input.password, 10)

      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashedPass,
      })
    }),

  authorizeUser: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (usr, { eq }) => eq(usr.email, input.email),
      })

      if (!user) {
        throw new TRPCError({ message: "User not found", code: "NOT_FOUND" })
      }

      // const isValidPass = await bcrypt.compare(input.password, user.password!)
      const isValidPass = input.password === user.password!

      if (!isValidPass) {
        throw new TRPCError({
          message: "Invalid credentials",
          code: "UNAUTHORIZED",
        })
      }

      return user
    }),
})
