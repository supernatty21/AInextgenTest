"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import type { AdminProduct } from "@/types/admin"

interface DeleteConfirmDialogProps {
  product: AdminProduct | null
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

function DeleteConfirmDialog({ product, loading, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={!!product} onOpenChange={(open) => { if (!open) onCancel() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบสินค้า</AlertDialogTitle>
          <AlertDialogDescription>
            คุณแน่ใจหรือไม่ที่จะลบ <strong>{product?.name}</strong>?
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading && <Spinner className="size-3" />}
            ลบ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteConfirmDialog }
