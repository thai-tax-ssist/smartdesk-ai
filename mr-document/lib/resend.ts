import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = 'Mr. Document <hello@mrdocument.ie>'
const ADMIN_EMAIL = () => process.env.ADMIN_EMAIL || 'shalongthaifood@gmail.com'

export async function sendWelcomeEmail({
  to,
  name,
  packageName,
  amount,
  orderId,
}: {
  to: string
  name: string
  packageName: string
  amount: number
  orderId: string
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Your Mr. Document order is confirmed! 🎉',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="background: #1a472a; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Mr. Document</h1>
          <p style="color: #a7d9b8; margin: 4px 0 0;">Your Documents, Sorted.</p>
        </div>
        <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${name},</p>
          <p>Thanks for choosing Mr. Document.</p>
          <div style="background: #f0f7f4; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0;"><strong>Your order:</strong> ${packageName} — €${amount}</p>
            <p style="margin: 8px 0 0;"><strong>Order ref:</strong> ${orderId}</p>
          </div>
          <h3>What happens next:</h3>
          <ol>
            <li>Our team reviews your requirements</li>
            <li>We build your custom document</li>
            <li>You'll receive your document link within 24 hours</li>
          </ol>
          <p>Questions? Chat with Shay any time at <a href="https://mrdocument.ie" style="color: #1a472a;">mrdocument.ie</a></p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">Your Documents, Sorted.<br>Mr. Document, Cork 🍀</p>
        </div>
      </div>
    `,
  })
}

export async function sendNewOrderNotification({
  clientEmail,
  packageName,
  platform,
  amount,
  brief,
  orderId,
}: {
  clientEmail: string
  packageName: string
  platform: string
  amount: number
  brief: string
  orderId: string
}) {
  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mrdocument.ie'
  return getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL(),
    subject: `New order — ${packageName} — €${amount}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a472a;">New order received!</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Client</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${clientEmail}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Package</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${packageName} (${platform})</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Amount</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">€${amount}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Requirement</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${brief || 'None provided'}</td></tr>
        </table>
        <p><a href="${adminUrl}/admin/orders/${orderId}" style="background: #1a472a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">View Order</a></p>
      </div>
    `,
  })
}

export async function sendDocumentDeliveredEmail({
  to,
  name,
  title,
  link,
  guide,
}: {
  to: string
  name: string
  title: string
  link: string
  guide?: string
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Your document is ready! ✅',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="background: #1a472a; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Mr. Document</h1>
        </div>
        <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${name},</p>
          <p>Great news — your document is ready!</p>
          <h3>${title}</h3>
          <p><a href="${link}" style="background: #1a472a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Open your document</a></p>
          ${guide ? `<div style="margin-top: 24px; padding: 16px; background: #f0f7f4; border-radius: 8px;"><h4>Quick guide</h4><p style="white-space: pre-line;">${guide}</p></div>` : ''}
          <p style="margin-top: 24px;">Need anything adjusted? Reply to this email or chat with Shay.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">Mr. Document, Cork 🍀</p>
        </div>
      </div>
    `,
  })
}
