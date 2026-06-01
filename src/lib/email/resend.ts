import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@thegentryhouse.com'
export const EMAIL_TO = process.env.RESEND_TO_EMAIL || 'hello@thegentryhouse.com'
