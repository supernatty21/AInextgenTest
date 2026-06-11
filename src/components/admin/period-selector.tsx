import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Period } from "@/types/admin"

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
}

const periods: { value: Period; label: string }[] = [
  { value: "7d", label: "7 วัน" },
  { value: "30d", label: "30 วัน" },
  { value: "90d", label: "90 วัน" },
]

function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 rounded-4xl border bg-muted/50 p-0.5">
      {periods.map((p) => (
        <Button
          key={p.value}
          size="xs"
          variant={value === p.value ? "default" : "ghost"}
          onClick={() => onChange(p.value)}
          className={cn(
            "rounded-3xl px-3",
            value !== p.value && "text-muted-foreground"
          )}
        >
          {p.label}
        </Button>
      ))}
    </div>
  )
}

export { PeriodSelector }
export type { Period, PeriodSelectorProps }
