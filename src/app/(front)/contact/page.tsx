import ContactForm from "./contact-form"

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">ติดต่อเรา</h1>
          <p className="text-muted-foreground text-lg">
            มีคำถามหรือต้องการความช่วยเหลือ กรุณากรอกข้อมูลด้านล่าง เราจะตอบกลับโดยเร็วที่สุด
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  )
}