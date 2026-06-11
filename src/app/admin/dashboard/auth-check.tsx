import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import type { ReactNode } from "react"

export default async function AdminAuthCheck({ children }: { children: ReactNode }) {
  await connection()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return <>{children}</>
}
