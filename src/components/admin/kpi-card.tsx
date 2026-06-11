import { Card, CardContent } from "@/components/ui/card"
import type { RemixiconComponentType } from "@remixicon/react"

interface KpiCardProps {
  title: string
  value: string
  icon: RemixiconComponentType
}

function KpiCard({ title, value, icon: Icon }: KpiCardProps) {
  return (
    <Card size="sm" className="flex-1 min-w-[160px]">
      <CardContent className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-heading text-2xl font-semibold">{value}</p>
        </div>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function KpiCardSkeleton() {
  return (
    <Card size="sm" className="flex-1 min-w-[160px]">
      <CardContent className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-7 w-24 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="size-9 animate-pulse rounded-full bg-muted" />
      </CardContent>
    </Card>
  )
}

export { KpiCard, KpiCardSkeleton }
export type { KpiCardProps }
