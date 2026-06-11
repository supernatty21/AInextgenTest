import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import AdminAuthCheck from "../auth-check"
import CategoriesClient from "./categories-client"

export default function AdminCategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <AdminAuthCheck>
        <CategoriesClient />
      </AdminAuthCheck>
    </Suspense>
  )
}
