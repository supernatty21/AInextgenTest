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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await checkAdmin(request.headers)
  if (unauth) return unauth

  const { id } = await params
  const productId = Number(id)
  if (isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid ID" } as const, { status: 400 })
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "ไม่พบสินค้า" } as const, { status: 404 })
  }

  const body = await request.json()
  const result = productSchema.safeParse(body)
  if (!result.success) {
    const error = result.error.issues.map((i) => i.message).join(", ")
    return NextResponse.json({ success: false, error } as const, { status: 400 })
  }

  const { name, description, price, categoryId } = result.data

  const product = await prisma.products.update({
    where: { id: productId },
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await checkAdmin(request.headers)
  if (unauth) return unauth

  const { id } = await params
  const productId = Number(id)
  if (isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid ID" } as const, { status: 400 })
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "ไม่พบสินค้า" } as const, { status: 404 })
  }

  const orderCount = await prisma.order_items.count({ where: { product_id: productId } })
  if (orderCount > 0) {
    return NextResponse.json(
      { success: false, error: `ไม่สามารถลบได้ — สินค้านี้มี ${orderCount} รายการในคำสั่งซื้อ` } as const,
      { status: 409 }
    )
  }

  await prisma.products.delete({ where: { id: productId } })

  return NextResponse.json({ success: true, data: null } as const)
}
