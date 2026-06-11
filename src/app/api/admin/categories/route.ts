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

export async function GET(request: Request) {
  const unauth = await checkAdmin(request.headers)
  if (unauth) return unauth

  const categories = await prisma.categories.findMany({
    orderBy: { name: "asc" },
  })

  const data = categories.map((c) => ({
    id: String(c.id),
    name: c.name ?? "",
  }))

  return NextResponse.json({ success: true, data } as const)
}

export async function POST(request: Request) {
  const unauth = await checkAdmin(request.headers)
  if (unauth) return unauth

  const body = await request.json()
  const name = String(body.name ?? "").trim()
  if (!name) {
    return NextResponse.json({ success: false, error: "กรุณากรอกชื่อหมวดหมู่" } as const, { status: 400 })
  }

  const category = await prisma.categories.create({ data: { name } })

  return NextResponse.json({
    success: true,
    data: { id: String(category.id), name: category.name ?? "" },
  } as const)
}
