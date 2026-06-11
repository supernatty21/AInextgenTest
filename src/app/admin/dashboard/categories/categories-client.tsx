"use client"

import { useEffect, useState } from "react"
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import type { CategoryOption } from "@/types/admin"
import { CategoryFormDialog } from "./category-form-dialog"

export default function CategoriesClient() {
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryOption | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchCategories = () => {
    setLoading(true)
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setCategories(json.data)
          setCategories(json.data)
        }
      })
      .catch(() => toast.error("ไม่สามารถโหลดข้อมูลหมวดหมู่ได้"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let ignore = false
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((json) => {
        if (!ignore && json.success) setCategories(json.data)
      })
      .catch(() => { if (!ignore) toast.error("ไม่สามารถโหลดข้อมูลหมวดหมู่ได้") })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [])

  const handleSave = async (name: string) => {
    setSubmitting(true)
    try {
      const url = editCategory
        ? `/api/admin/categories/${editCategory.id}`
        : "/api/admin/categories"
      const method = editCategory ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error || "เกิดข้อผิดพลาด")
        return
      }
      toast.success(editCategory ? "แก้ไขหมวดหมู่สำเร็จ" : "เพิ่มหมวดหมู่สำเร็จ")
      setFormOpen(false)
      setEditCategory(null)
      fetchCategories()
    } catch {
      toast.error("เกิดข้อผิดพลาด")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (category: CategoryOption) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${category.name}"?`)) return
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error || "เกิดข้อผิดพลาด")
        return
      }
      toast.success("ลบหมวดหมู่สำเร็จ")
      fetchCategories()
    } catch {
      toast.error("เกิดข้อผิดพลาด")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">จัดการหมวดหมู่</h1>
        <Button onClick={() => { setEditCategory(null); setFormOpen(true) }}>
          <RiAddLine className="mr-1 size-4" />
          เพิ่มหมวดหมู่
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">ชื่อหมวดหมู่</th>
              <th className="px-4 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  ยังไม่มีหมวดหมู่
                </td>
              </tr>
            ) : (
              categories.map((cat, i) => (
                <tr key={cat.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setEditCategory(cat); setFormOpen(true) }}
                      >
                        <RiPencilLine className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(cat)}
                      >
                        <RiDeleteBinLine className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoryFormDialog
        open={formOpen}
        category={editCategory}
        loading={submitting}
        onSave={handleSave}
        onClose={() => { setFormOpen(false); setEditCategory(null) }}
      />
    </div>
  )
}
