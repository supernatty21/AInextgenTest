"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import type { CategoryOption } from "@/types/admin"

const categorySchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormDialogProps {
  open: boolean
  category: CategoryOption | null
  loading: boolean
  onSave: (name: string) => void
  onClose: () => void
}

function CategoryFormDialog({
  open,
  category,
  loading,
  onSave,
  onClose,
}: CategoryFormDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (open) {
      form.reset({ name: category?.name ?? "" })
    }
  }, [open, category, form])

  const handleSubmit = form.handleSubmit((values) => onSave(values.name))

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}</DialogTitle>
          <DialogDescription>
            {category ? "แก้ไขชื่อหมวดหมู่" : "กรอกชื่อหมวดหมู่ที่ต้องการเพิ่ม"}
          </DialogDescription>
        </DialogHeader>
        <form id="category-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category-name">ชื่อหมวดหมู่</FieldLabel>
                  <Input {...field} id="category-name" placeholder="ชื่อหมวดหมู่" />
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
          <Button type="submit" form="category-form" disabled={loading}>
            {loading && <Spinner className="size-3" />}
            {category ? "บันทึก" : "สร้าง"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { CategoryFormDialog }
