import { Suspense, type ReactNode } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { RiDashboardLine, RiStore3Line, RiPriceTag3Line, RiShoppingBasketLine, RiLogoutBoxLine } from "@remixicon/react"
import "../globals.css"
import AdminHeader from "./admin-header"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "ระบบจัดการหลังบ้าน",
}

const sidebarLinks = [
  { href: "/admin/dashboard", label: "ภาพรวม", icon: RiDashboardLine },
  { href: "/admin/dashboard/products", label: "สินค้า", icon: RiStore3Line },
  { href: "/admin/dashboard/categories", label: "หมวดหมู่", icon: RiPriceTag3Line },
  { href: "/admin/orders", label: "คำสั่งซื้อ", icon: RiShoppingBasketLine, disabled: true },
]

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="th" className="font-sans">
      <body>
        <div className="flex min-h-screen bg-muted/30">
          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 border-r bg-background md:flex md:flex-col">
            <div className="flex h-14 items-center gap-2 border-b px-4 font-medium">
              <RiDashboardLine className="size-5 text-primary" />
              <span>Admin Panel</span>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {sidebarLinks.map((link) =>
                link.disabled ? (
                  <span
                    key={link.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
                  >
                    <link.icon className="size-4" />
                    {link.label}
                  </span>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <link.icon className="size-4" />
                    {link.label}
                  </Link>
                )
              )}
            </nav>
            <div className="mt-auto border-t p-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                <RiLogoutBoxLine className="size-4" />
                กลับหน้าเว็บ
              </Link>
            </div>
          </aside>

          {/* Main area */}
          <div className="flex flex-1 flex-col">
            <Suspense
              fallback={
                <header className="sticky top-0 z-50 border-b bg-background">
                  <div className="flex h-14 items-center px-4">
                    <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </header>
              }
            >
              <AdminHeader />
            </Suspense>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
