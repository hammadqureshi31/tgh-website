'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import {
  careerApplicationSchema,
  ALLOWED_RESUME_MIME_TYPES,
  ALLOWED_PORTFOLIO_MIME_TYPES,
  MAX_RESUME_SIZE,
  MAX_PORTFOLIO_FILE_SIZE,
  MAX_PORTFOLIO_FILES,
} from '@/lib/validations/career'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend, EMAIL_TO } from '@/lib/email/resend'
import CareerApplicationNotificationEmail from '@/lib/email/templates/career-application-notification'
import CareerApplicationConfirmationEmail from '@/lib/email/templates/career-application-confirmation'

// In-memory rate limiting, same approach as the lead form (see actions/leads.ts):
// avoids a network round trip per submission and is sufficient for current traffic.
const rateLimitStore = new Map<string, { count: number; expiresAt: number }>()
const RATE_LIMIT_REQUESTS = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function getClientIp(headersList: Headers): string {
  const forwarded = headersList.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headersList.get('x-real-ip') || 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean } {
  const hourKey = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS)
  const key = `${ip}:${hourKey}`
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || record.expiresAt < now) {
    rateLimitStore.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }
  if (record.count >= RATE_LIMIT_REQUESTS) return { allowed: false }
  record.count += 1
  return { allowed: true }
}

function getFileExtension(file: File): string {
  const mimeMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
  }
  return mimeMap[file.type] || file.name.split('.').pop() || 'bin'
}

function uniqueFilename(file: File): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}.${getFileExtension(file)}`
}

export interface SubmitApplicationResult {
  success: boolean
  error?: string
  errors?: Record<string, string[] | undefined>
}

export async function submitApplication(formData: FormData): Promise<SubmitApplicationResult> {
  try {
    // 1. Validate text fields with Zod
    const rawFields = {
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      years_experience: formData.get('years_experience'),
      instagram_url: formData.get('instagram_url') || '',
      current_shop: formData.get('current_shop') || '',
      position_applied: formData.get('position_applied'),
      preferred_location: formData.get('preferred_location'),
      additional_notes: formData.get('additional_notes') || '',
      honeypot: formData.get('honeypot') || '',
    }

    let validatedData
    try {
      validatedData = careerApplicationSchema.parse(rawFields)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error.flatten().fieldErrors }
      }
      throw error
    }

    // 2. Honeypot — silently reject without revealing
    if (validatedData.honeypot) {
      return { success: true }
    }

    // 3. Rate limiting
    const headersList = await headers()
    const clientIp = getClientIp(headersList)
    if (!checkRateLimit(clientIp).allowed) {
      return { success: false, error: 'Too many submissions. Please try again in an hour.' }
    }

    // 4. Validate resume (required)
    const resumeFile = formData.get('resume') as File | null
    if (!resumeFile || resumeFile.size === 0) {
      return { success: false, error: 'A resume upload is required.' }
    }
    if (!ALLOWED_RESUME_MIME_TYPES.includes(resumeFile.type)) {
      return { success: false, error: 'Resume must be a PDF or Word document.' }
    }
    if (resumeFile.size > MAX_RESUME_SIZE) {
      return { success: false, error: 'Resume file size exceeds 10MB limit.' }
    }

    // 5. Validate portfolio photos (optional, multiple)
    const portfolioFiles = formData
      .getAll('portfolio')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)

    if (portfolioFiles.length > MAX_PORTFOLIO_FILES) {
      return { success: false, error: `Please upload at most ${MAX_PORTFOLIO_FILES} portfolio photos.` }
    }
    for (const file of portfolioFiles) {
      if (!ALLOWED_PORTFOLIO_MIME_TYPES.includes(file.type)) {
        return { success: false, error: 'Portfolio photos must be JPG, PNG, WebP, or AVIF images.' }
      }
      if (file.size > MAX_PORTFOLIO_FILE_SIZE) {
        return { success: false, error: 'Each portfolio photo must be under 10MB.' }
      }
    }

    const admin = createAdminClient()

    // 6. Upload resume
    const resumePath = uniqueFilename(resumeFile)
    const resumeBuffer = await resumeFile.arrayBuffer()
    const { data: resumeUpload, error: resumeUploadError } = await admin.storage
      .from('job-resumes')
      .upload(resumePath, resumeBuffer, { contentType: resumeFile.type, upsert: false })

    if (resumeUploadError || !resumeUpload) {
      console.error('[Career Application] Resume upload failed:', resumeUploadError)
      return { success: false, error: 'Failed to upload resume. Please try again.' }
    }

    const {
      data: { publicUrl: resumeUrl },
    } = admin.storage.from('job-resumes').getPublicUrl(resumeUpload.path)

    // 7. Upload portfolio photos
    const portfolioUrls: string[] = []
    for (const file of portfolioFiles) {
      const path = uniqueFilename(file)
      const buffer = await file.arrayBuffer()
      const { data: uploaded, error: uploadError } = await admin.storage
        .from('job-portfolios')
        .upload(path, buffer, { contentType: file.type, upsert: false })

      if (uploadError || !uploaded) {
        console.error('[Career Application] Portfolio upload failed:', uploadError)
        continue // don't fail the whole application over one photo
      }

      const {
        data: { publicUrl },
      } = admin.storage.from('job-portfolios').getPublicUrl(uploaded.path)
      portfolioUrls.push(publicUrl)
    }

    // 8. Insert application record (URLs only — files live in Storage, not the DB)
    const { data: application, error: insertError } = await (admin as any)
      .from('job_applications')
      .insert({
        full_name: validatedData.full_name,
        phone: validatedData.phone,
        email: validatedData.email,
        years_experience: validatedData.years_experience,
        instagram_url: validatedData.instagram_url || null,
        current_shop: validatedData.current_shop || null,
        position_applied: validatedData.position_applied,
        preferred_location: validatedData.preferred_location,
        resume_url: resumeUrl,
        portfolio_urls: portfolioUrls,
        additional_notes: validatedData.additional_notes || null,
        status: 'new',
      })
      .select()
      .single()

    if (insertError) {
      console.error('[Career Application] Supabase insert failed:', insertError)
      return { success: false, error: 'Failed to submit application. Please try again.' }
    }

    // 9. Notify hiring team (non-blocking failure)
    try {
      await resend.emails.send({
        from: 'noreply@thegentryhouse.com',
        to: EMAIL_TO,
        subject: `New Application: ${validatedData.full_name} — ${validatedData.position_applied}`,
        react: CareerApplicationNotificationEmail({
          fullName: validatedData.full_name,
          email: validatedData.email,
          phone: validatedData.phone,
          yearsExperience: validatedData.years_experience,
          positionApplied: validatedData.position_applied,
          preferredLocation: validatedData.preferred_location,
          instagramUrl: validatedData.instagram_url || null,
          currentShop: validatedData.current_shop || null,
          additionalNotes: validatedData.additional_notes || null,
          resumeUrl,
          portfolioCount: portfolioUrls.length,
          submittedAt: application.created_at,
        }),
      })
    } catch (emailError) {
      console.error('[Career Application] Hiring team notification failed:', emailError)
    }

    // 10. Confirmation email to applicant (non-blocking failure)
    try {
      await resend.emails.send({
        from: 'noreply@thegentryhouse.com',
        to: validatedData.email,
        subject: 'We received your application — The Gentry House',
        react: CareerApplicationConfirmationEmail({
          fullName: validatedData.full_name,
          positionApplied: validatedData.position_applied,
          preferredLocation: validatedData.preferred_location,
        }),
      })
    } catch (emailError) {
      console.error('[Career Application] Applicant confirmation failed:', emailError)
    }

    return { success: true }
  } catch (error) {
    console.error('[Career Application] Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
