"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { TRPCReactProvider } from "@/trpc/react"

export const Providers = ({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </NextThemesProvider>
  )
}
