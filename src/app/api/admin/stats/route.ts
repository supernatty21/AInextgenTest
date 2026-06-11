import prisma from "@/lib/prisma"

export async function GET() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)

  const [todayOrdersAgg, pendingOrders, totalProducts, totalUsers] = await Promise.all([
    prisma.orders.aggregate({
      _sum: { total_amount: true },
      _count: true,
      where: {
        date: { gte: startOfDay, lt: endOfDay },
      },
    }),
    prisma.orders.count({
      where: { status: "processing" },
    }),
    prisma.products.count(),
    prisma.user.count(),
  ])

  return Response.json({
    todaySales: Number(todayOrdersAgg._sum.total_amount ?? 0),
    todayOrders: todayOrdersAgg._count,
    pendingOrders,
    totalProducts,
    totalUsers,
  })
}
