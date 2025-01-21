import { auth } from "@/server/auth"
import Link from "next/link"

export const Header = async () => {
  const session = await auth()
  return (
    <>
      <header className="h-24 w-full fixed inset-x-0 top-6 flex justify-center items-center text-slate-200">
        <nav className="w-[90%] backdrop-blur-2xl px-12 py-4 rounded-full bg-white/10 flex justify-between h-full items-center">
          <ul className="flex w-full gap-x-4">
            <li>Home</li>
            <li>User</li>
          </ul>
          <ul className="flex">
            <li>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline whitespace-nowrap transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="h-16 w-full pointer-events-none bg-[#2e026d]" />
    </>
  )
}
