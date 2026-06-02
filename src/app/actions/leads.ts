'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { leadSchema, type LeadFormData } from '@/lib/validations/lead'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend, EMAIL_TO } from '@/lib/email/resend'
import LeadNotificationEmail from '@/lib/email/templates/lead-notification'

// In-memory rate limiting store
// Key: `${ip}:${hour}`, Value: count
// Note: For production at scale, this should be migrated to Supabase with a rate_limits table
// or to a distributed cache (Redis). For current use, in-memory is suitable as it:
// - Avoids network latency on every submission
// - Works across all Next.js workers in a deployment
// - Persists for the hour window within the process lifetime
const rateLimitStore = new Map<string, { count: number; expiresAt: number }>()
const RATE_LIMIT_REQUESTS = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function getClientIp(headersList: Headers): string {
  const forwarded = headersList.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return headersList.get('x-real-ip') || 'unknown'
}

function getHourlyKey(ip: string): string {
  const now = new Date()
  const hourKey = Math.floor(now.getTime() / RATE_LIMIT_WINDOW_MS)
  return `${ip}:${hourKey}`
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const key = getHourlyKey(ip)
  const now = Date.now()

  const record = rateLimitStore.get(key)

  if (!record || record.expiresAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1 }
  }

  if (record.count >= RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  record.count += 1
  return { allowed: true, remaining: RATE_LIMIT_REQUESTS - record.count }
}

function extractUtmParams(headersList: Headers) {
  // UTM params would typically come from the request URL via referer header
  // In a production system, these would be passed client-side via form hidden fields
  // For now, we'll set them to null and they can be enhanced client-side
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
  }
}

export async function submitLead(formData: unknown) {
  try {
    // 1. Validate input with Zod
    let validatedData: LeadFormData
    try {
      validatedData = leadSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        return {
          success: false,
          errors: fieldErrors,
        }
      }
      throw error
    }

    // 2. Check honeypot - silently reject without revealing
    if (validatedData.honeypot) {
      return { success: true }
    }

    // 3. Rate limiting
    const headersList = await headers()
    const clientIp = getClientIp(headersList)
    const rateLimit = checkRateLimit(clientIp)

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'Too many submissions. Please try again in an hour.',
      }
    }

    // 4. Extract UTM params and source page
    const utmParams = extractUtmParams(headersList)
    const sourcePage = headersList.get('referer') || null

    // 5. Insert lead into Supabase
    const admin = createAdminClient()

    const { data, error: insertError } = await (admin as any)
      .from('leads')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        service_interest: validatedData.service_interest || null,
        message: validatedData.message,
        source_page: sourcePage,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        status: 'new',
      })
      .select()
      .single()

    if (insertError) {
      console.error('[Lead Submission] Supabase insert failed:', insertError)
      return {
        success: false,
        error: 'Failed to submit lead. Please try again.',
      }
    }

    // 6. Send notification email (non-blocking failure)
    try {
      await resend.emails.send({
        from: 'noreply@thegentryhouse.com',
        to: EMAIL_TO,
        subject: `New Lead: ${validatedData.name}`,
        react: LeadNotificationEmail({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          serviceInterest: validatedData.service_interest || null,
          message: validatedData.message || null,
          submittedAt: new Date().toISOString(),
        }),
      })
    } catch (emailError) {
      // Log but don't block - lead is already saved
      console.error('[Lead Submission] Email notification failed:', emailError)
    }

    return { success: true }
  } catch (error) {
    console.error('[Lead Submission] Unexpected error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}
