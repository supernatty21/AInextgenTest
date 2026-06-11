"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  RiAddLine,
  RiPencilLine,
  RiDeleteBin6Line,
  RiStore3Line,
  RiSearchLine,
} from "@remixicon/react"
import { toast } from "sonner"
import { ProductFormModal } from "./product-form-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import type { AdminProduct, CategoryOption } from "@/types/admin"
import type { ProductFormValues } from "@/lib/validations/product"

const currencyFormat = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

export default function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handlePageChange = (p: number) => {
    setLoading(true)
    setPage(p)
  }

  const handleRefresh = () => {
    setLoading(true)
    setRefreshKey((k) => k + 1)
  }

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const params = new URLSearchParams({ page: String(page) })
        if (search) params.set("search", search)
        const res = await fetch(`/api/admin/products?${params}`)
        const json = await res.json()
        if (!ignore && json.success) {
          setProducts(json.data.items)
          setTotal(json.data.total)
        }
      } catch {
        if (!ignore) toast.error("ไม่สามารถโหลดข้อมูลสินค้าได้")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [page, search, refreshKey])

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const res = await fetch("/api/admin/categories")
        const json = await res.json()
        if (!ignore && json.success) setCategories(json.data)
      } catch {
        // silent
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  const handleSave = async (values: ProductFormValues) => {
    try {
      setSubmitting(true)
      const url = editProduct
        ? `/api/admin/products/${editProduct.id}`
        : "/api/admin/products"
      const method = editProduct ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error)
        return
      }
      toast.success(editProduct ? "แก้ไขสินค้าสำเร็จ" : "เพิ่มสินค้าสำเร็จ")
      setFormOpen(false)
      setEditProduct(null)
      handleRefresh()
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error)
        setDeleting(false)
        return
      }
      toast.success("ลบสินค้าสำเร็จ")
      setDeleteTarget(null)
      handleRefresh()
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setDeleting(false)
    }
  }

  const openCreate = () => {
    setEditProduct(null)
    setFormOpen(true)
  }

  const openEdit = (product: AdminProduct) => {
    setEditProduct(product)
    setFormOpen(true)
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">สินค้า</h1>
        <Button onClick={openCreate}>
          <RiAddLine className="size-3" />
          เพิ่มสินค้า
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <RiStore3Line className="size-4 text-primary" />
              รายการสินค้า
            </CardTitle>
            <div className="relative">
              <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-9 w-56 rounded-3xl pl-9"
                placeholder="ค้นหาสินค้า..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead className="w-24 text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center">
                    <Spinner className="mx-auto size-5 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                    {search ? "ไม่พบสินค้าที่ค้นหา" : "ยังไม่มีสินค้า"}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.categoryName}</Badge>
                    </TableCell>
                    <TableCell>{currencyFormat.format(p.price)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => openEdit(p)}
                        >
                          <RiPencilLine />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setDeleteTarget(p)}
                        >
                          <RiDeleteBin6Line className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            ก่อนหน้า
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            ถัดไป
          </Button>
        </div>
      )}

      <ProductFormModal
        open={formOpen}
        product={editProduct}
        categories={categories}
        loading={submitting}
        onSave={handleSave}
        onClose={() => { setFormOpen(false); setEditProduct(null) }}
      />

      <DeleteConfirmDialog
        product={deleteTarget}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteTarget(null); setDeleting(false) }}
      />
    </div>
  )
}
