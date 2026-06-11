"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card"
import { PeriodSelector } from "@/components/admin/period-selector"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import {
  RiRefreshLine,
  RiMoneyDollarCircleLine,
  RiShoppingBasketLine,
  RiTimeLine,
  RiStore3Line,
  RiGroupLine,
} from "@remixicon/react"
import type { AdminStats, RevenuePoint, AdminOrderItem, Period } from "@/types/admin"
import dynamic from "next/dynamic"

const RevenueChart = dynamic(
  () => import("@/components/admin/revenue-chart").then((m) => ({ default: m.RevenueChart })),
  { ssr: false, loading: () => <RevenueChartSkeleton /> }
)

function RevenueChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="size-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] animate-pulse rounded-lg bg-muted" />
      </CardContent>
    </Card>
  )
}

const currencyFormat = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

export default function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)

  const [period, setPeriod] = useState<Period>("30d")

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setStatsLoading(true)
    setStatsError(null)
    setOrdersLoading(true)
    setOrdersError(null)
    setRefreshKey((k) => k + 1)
  }

  const handleRetryStats = () => {
    setStatsLoading(true)
    setStatsError(null)
    setRefreshKey((k) => k + 1)
  }

  const handleRetryOrders = () => {
    setOrdersLoading(true)
    setOrdersError(null)
    setRefreshKey((k) => k + 1)
  }

  const handlePeriodChange = (p: Period) => {
    setRevenueLoading(true)
    setPeriod(p)
  }

  useEffect(() => {
    let ignore = false

    const loadStats = fetch("/api/admin/stats").then((res) => {
      if (ignore) return null
      if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลสถิติได้")
      return res.json() as Promise<AdminStats>
    })

    const loadOrders = fetch("/api/admin/orders?limit=5").then((res) => {
      if (ignore) return null
      if (!res.ok) throw new Error("ไม่สามารถโหลดคำสั่งซื้อล่าสุดได้")
      return res.json() as Promise<{ orders: AdminOrderItem[]; total: number }>
    })

    Promise.all([loadStats, loadOrders])
      .then(([statsData, ordersData]) => {
        if (ignore) return
        if (statsData) setStats(statsData)
        if (ordersData) setOrders(ordersData.orders)
      })
      .catch((err) => {
        if (ignore) return
        const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด"
        if (err.message?.includes("สถิติ")) setStatsError(message)
        if (err.message?.includes("คำสั่งซื้อ")) setOrdersError(message)
      })
      .finally(() => {
        if (ignore) return
        setStatsLoading(false)
        setOrdersLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [refreshKey])

  useEffect(() => {
    let ignore = false

    fetch(`/api/admin/revenue?period=${period}`)
      .then((res) => {
        if (ignore) return null
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลรายได้ได้")
        return res.json() as Promise<RevenuePoint[]>
      })
      .then((data) => {
        if (ignore) return
        if (data) setRevenue(data)
      })
      .catch(() => {
        if (!ignore) setRevenue([])
      })
      .finally(() => {
        if (!ignore) setRevenueLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [period])

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1)
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  const kpis = stats
    ? [
        { title: "ยอดขายวันนี้", value: currencyFormat.format(stats.todaySales), icon: RiMoneyDollarCircleLine },
        { title: "คำสั่งซื้อวันนี้", value: String(stats.todayOrders), icon: RiShoppingBasketLine },
        { title: "รอดำเนินการ", value: String(stats.pendingOrders), icon: RiTimeLine },
        { title: "สินค้าทั้งหมด", value: String(stats.totalProducts), icon: RiStore3Line },
        { title: "ผู้ใช้ทั้งหมด", value: String(stats.totalUsers), icon: RiGroupLine },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">ภาพรวม</h1>
        <Button size="sm" variant="outline" onClick={handleRefresh}>
          <RiRefreshLine className="size-3" />
          รีเฟรช
        </Button>
      </div>

      {statsError ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-destructive">{statsError}</p>
          <Button size="sm" variant="outline" onClick={handleRetryStats}>
            <RiRefreshLine className="size-3" />
            ลองใหม่
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {statsLoading || !stats
            ? Array.from({ length: 5 }).map((_, i) => <KpiCardSkeleton key={i} />)
            : kpis.map((kpi) => (
                <KpiCard key={kpi.title} title={kpi.title} value={kpi.value} icon={kpi.icon} />
              ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-medium">รายได้</h2>
          <PeriodSelector value={period} onChange={handlePeriodChange} />
        </div>
        <RevenueChart data={revenue} loading={revenueLoading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RiShoppingBasketLine className="size-4 text-primary" />
            คำสั่งซื้อล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RecentOrdersTable
            orders={orders}
            loading={ordersLoading}
            error={ordersError}
            onRetry={handleRetryOrders}
          />
        </CardContent>
      </Card>
    </div>
  )
}
