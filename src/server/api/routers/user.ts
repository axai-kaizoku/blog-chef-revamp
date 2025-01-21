import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany({})
  }),
})
