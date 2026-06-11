import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import { NextResponse } from "next/server"

async function checkAdmin(headers: Headers) {
  const session = await auth.api.getSession({ headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" } as const,
      { status: 401 }
    )
  }
}

export async function GET(request: Request) {
  const unauth = await checkAdmin(request.headers)
  if (unauth) return unauth

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = 10
  const skip = (page - 1) * limit

  const where = search
    ? { name: { contains: search } }
    : {}

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: { categories: { select: { name: true } } },
    }),
    prisma.products.count({ where }),
  ])

  const data = products.map((p) => ({
    id: String(p.id),
    name: p.name ?? "",
    description: p.description,
    price: Number(p.price ?? 0),
    categoryId: String(p.category_id ?? ""),
    categoryName: p.categories?.name ?? "",
  }))

  return NextResponse.json({ success: true, data: { items: data, total, page, limit } } as const)
}

export async function POST(request: Request) {
  const unauth = await checkAdmin(request.headers)
  if (unauth) return unauth

  const body = await request.json()
  const result = productSchema.safeParse(body)
  if (!result.success) {
    const error = result.error.issues.map((i) => i.message).join(", ")
    return NextResponse.json({ success: false, error } as const, { status: 400 })
  }

  const { name, description, price, categoryId } = result.data

  const product = await prisma.products.create({
    data: {
      name,
      description: description || null,
      price,
      category_id: Number(categoryId),
    },
    include: { categories: { select: { name: true } } },
  })

  return NextResponse.json({
    success: true,
    data: {
      id: String(product.id),
      name: product.name ?? "",
      description: product.description,
      price: Number(product.price ?? 0),
      categoryId: String(product.category_id ?? ""),
      categoryName: product.categories?.name ?? "",
    },
  } as const)
}
