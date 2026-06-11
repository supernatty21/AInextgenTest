import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { RiDashboardLine, RiLogoutBoxLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"

export default async function AdminHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-(--breakpoint-2xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-medium">
          <RiDashboardLine className="size-5 text-primary" />
          <span>Admin</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {session?.user.name ?? "ผู้ดูแลระบบ"}
          </span>
          <Button asChild size="xs" variant="ghost">
            <Link href="/">
              <RiLogoutBoxLine className="size-3" />
              กลับหน้าเว็บ
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
