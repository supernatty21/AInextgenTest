"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Phone, Clock, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"
import { toast } from "sonner"

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
        }

        form.reset()
        setIsSuccess(true)
        toast.success("ส่งข้อความสำเร็จ")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <CheckCircle className="size-16 text-green-500" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-bold">ส่งข้อความสำเร็จ</h2>
          <p className="mt-2 text-muted-foreground">
            ขอบคุณที่ติดต่อเรา เราจะตอบกลับโดยเร็วที่สุด
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
          disabled={isPending}
        >
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">ข้อมูลติดต่อ</h3>
          <div className="flex items-start gap-3">
            <Mail className="size-5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium">อีเมล</p>
              <p className="text-muted-foreground">support@example.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="size-5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium">เบอร์โทร</p>
              <p className="text-muted-foreground">02-123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="size-5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium">เวลาทำการ</p>
              <p className="text-muted-foreground">จันทร์ - ศุกร์ 09:00 - 18:00 น.</p>
            </div>
          </div>
        </div>
        <Separator />
        <p className="text-muted-foreground text-sm">
          หรือสามารถกรอกแบบฟอร์มด้านขวาได้เลยครับ ทีมงานจะติดต่อกลับโดยเร็วที่สุด
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Field>
          <FieldLabel htmlFor="name">ชื่อ</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              placeholder="กรอกชื่อของคุณ"
              {...form.register("name")}
              aria-invalid={!!form.formState.errors.name}
              disabled={isPending}
            />
            <FieldError errors={form.formState.errors.name ? [{ message: form.formState.errors.name.message }] : undefined} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">อีเมล</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
              disabled={isPending}
            />
            <FieldError errors={form.formState.errors.email ? [{ message: form.formState.errors.email.message }] : undefined} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="message">ข้อความ</FieldLabel>
          <FieldContent>
            <Textarea
              id="message"
              rows={5}
              placeholder="พิมพ์ข้อความที่ต้องการ..."
              {...form.register("message")}
              aria-invalid={!!form.formState.errors.message}
              disabled={isPending}
            />
            <FieldError errors={form.formState.errors.message ? [{ message: form.formState.errors.message.message }] : undefined} />
          </FieldContent>
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              กำลังส่ง...
            </>
          ) : (
            "ส่งข้อความ"
          )}
        </Button>
      </form>
    </div>
  )
}