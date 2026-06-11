import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "30d"

  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const orders = await prisma.orders.findMany({
    where: {
      date: { gte: startDate },
    },
    orderBy: { date: "asc" },
    select: {
      date: true,
      total_amount: true,
      id: true,
    },
  })

  const grouped = new Map<string, { revenue: number; orders: number }>()

  for (const order of orders) {
    if (!order.date) continue
    const dateStr = order.date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
    })
    const existing = grouped.get(dateStr) || { revenue: 0, orders: 0 }
    existing.revenue += Number(order.total_amount ?? 0)
    existing.orders += 1
    grouped.set(dateStr, existing)
  }

  const revenue = Array.from(grouped.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders,
  }))

  return Response.json(revenue)
}
