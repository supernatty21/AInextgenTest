import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get("limit")) || 5

  const orders = await prisma.orders.findMany({
    take: limit,
    orderBy: { date: "desc" },
    include: {
      customers: {
        select: { name: true },
      },
    },
  })

  const mapped = orders.map((order) => ({
    id: order.id,
    customerName: order.customers?.name ?? "ไม่ระบุ",
    total: Number(order.total_amount ?? 0),
    status: order.status ?? "processing",
    date: order.date?.toLocaleDateString("th-TH") ?? "",
  }))

  return Response.json({ orders: mapped, total: mapped.length })
}
