import { contactSchema } from "@/lib/validations/contact"
import { Resend } from "resend"

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      const errorMessage = result.error.issues.map((issue) => issue.message).join(", ")
      return Response.json({ success: false, error: errorMessage }, { status: 400 })
    }

    const { name, email, message } = result.data

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: process.env.CONTACT_RECEIVER_EMAIL || "receiver@example.com",
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    })

    return Response.json({ success: true, data: { message: "Email sent successfully" } })
  } catch (error) {
    console.error("Contact API error:", error)
    return Response.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}