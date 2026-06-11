import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await checkAdmin(request.headers)
  if (unauth) return unauth

  const { id } = await params
  const body = await request.json()
  const name = String(body.name ?? "").trim()
  if (!name) {
    return NextResponse.json({ success: false, error: "กรุณากรอกชื่อหมวดหมู่" } as const, { status: 400 })
  }

  const category = await prisma.categories.update({
    where: { id: Number(id) },
    data: { name },
  })

  return NextResponse.json({
    success: true,
    data: { id: String(category.id), name: category.name ?? "" },
  } as const)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await checkAdmin(request.headers)
  if (unauth) return unauth

  const { id } = await params

  const productCount = await prisma.products.count({
    where: { category_id: Number(id) },
  })
  if (productCount > 0) {
    return NextResponse.json({
      success: false,
      error: `ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ ${productCount} รายการ`,
    } as const, { status: 400 })
  }

  await prisma.categories.delete({ where: { id: Number(id) } })

  return NextResponse.json({ success: true, data: null } as const)
}
