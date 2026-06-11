import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import AdminAuthCheck from "./auth-check"
import DashboardClient from "./dashboard-client"

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <AdminAuthCheck>
        <DashboardClient />
      </AdminAuthCheck>
    </Suspense>
  )
}
