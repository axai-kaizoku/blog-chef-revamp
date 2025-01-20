"use client"
import { api } from "@/trpc/react"
import type { Session } from "next-auth"

export const Secret = ({ session }: { session: Session | null }) => {
  const { data } = api.post.getSecretMessage.useQuery(undefined, {
    enabled: session?.user !== undefined,
  })

  return data && <span className="text-base"> - {data}</span>
}
