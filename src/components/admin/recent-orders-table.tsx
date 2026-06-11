import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { RiRefreshLine } from "@remixicon/react"
import type { AdminOrderItem } from "@/types/admin"

const currencyFormat = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

const statusConfig: Record<
  AdminOrderItem["status"],
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  delivered: { label: "จัดส่งแล้ว", variant: "default" },
  received: { label: "ได้รับแล้ว", variant: "secondary" },
  processing: { label: "กำลังดำเนินการ", variant: "outline" },
}

interface RecentOrdersTableProps {
  orders: AdminOrderItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

function RecentOrdersTable({ orders, loading, error, onRetry }: RecentOrdersTableProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RiRefreshLine className="size-3" />
          ลองใหม่
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>คำสั่งซื้อ</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>ยอดรวม</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead className="text-right">วันที่</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="py-12 text-center">
              <Spinner className="mx-auto size-5 text-muted-foreground" />
            </TableCell>
          </TableRow>
        ) : orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
              ไม่พบคำสั่งซื้อ
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => {
            const config = statusConfig[order.status]
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{currencyFormat.format(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {order.date}
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}

export { RecentOrdersTable }
