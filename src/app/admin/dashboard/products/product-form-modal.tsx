"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { productSchema, type ProductFormValues } from "@/lib/validations/product"
import type { AdminProduct, CategoryOption } from "@/types/admin"

interface ProductFormModalProps {
  open: boolean
  product: AdminProduct | null
  categories: CategoryOption[]
  loading: boolean
  onSave: (values: ProductFormValues) => void
  onClose: () => void
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
}

function ProductFormModal({
  open,
  product,
  categories,
  loading,
  onSave,
  onClose,
}: ProductFormModalProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        product
          ? {
              name: product.name,
              description: product.description ?? "",
              price: product.price,
              categoryId: product.categoryId,
            }
          : defaultValues
      )
    }
  }, [open, product, form])

  const handleSubmit = form.handleSubmit(onSave)

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลสินค้าด้านล่าง
          </DialogDescription>
        </DialogHeader>
        <form id="product-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">ชื่อสินค้า</FieldLabel>
                  <Input {...field} id="product-name" placeholder="ชื่อสินค้า" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-desc">รายละเอียด</FieldLabel>
                  <Textarea
                    {...field}
                    id="product-desc"
                    placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
                    rows={3}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">ราคา</FieldLabel>
                  <Input
                    {...field}
                    id="product-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    onChange={(e) => onChange(e.target.valueAsNumber || 0)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-category">หมวดหมู่</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="product-category" className="w-full">
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            ยกเลิก
          </Button>
          <Button type="submit" form="product-form" disabled={loading}>
            {loading && <Spinner className="size-3" />}
            {product ? "บันทึก" : "สร้าง"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ProductFormModal }
