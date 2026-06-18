import { z } from 'zod'
import { CAREER_LOCATIONS, CAREER_POSITIONS } from '@/lib/careers'

const PHONE_PATTERN = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
const URL_PATTERN = /^https?:\/\/.+/i

const LOCATION_NAMES = CAREER_LOCATIONS.map((loc) => loc.name) as [string, ...string[]]
const POSITION_NAMES = [...CAREER_POSITIONS] as [string, ...string[]]

export const ALLOWED_RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
export const ALLOWED_PORTFOLIO_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const MAX_RESUME_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_PORTFOLIO_FILE_SIZE = 10 * 1024 * 1024 // 10MB per image
export const MAX_PORTFOLIO_FILES = 8

export const careerApplicationSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z
    .string()
    .trim()
    .min(7, 'Please provide a valid phone number')
    .regex(PHONE_PATTERN, 'Please provide a valid phone number'),
  email: z.string().trim().email('Please provide a valid email address'),
  years_experience: z.coerce
    .number()
    .int('Years of experience must be a whole number')
    .min(0, 'Years of experience cannot be negative')
    .max(60, 'Please enter a realistic number of years'),
  instagram_url: z
    .string()
    .trim()
    .regex(URL_PATTERN, 'Please provide a full URL (e.g. https://instagram.com/yourhandle)')
    .optional()
    .or(z.literal('')),
  current_shop: z.string().trim().max(150).optional().or(z.literal('')),
  position_applied: z.enum(POSITION_NAMES, {
    errorMap: () => ({ message: 'Please select the position you are applying for' }),
  }),
  preferred_location: z.enum(LOCATION_NAMES, {
    errorMap: () => ({ message: 'Please select your preferred location' }),
  }),
  additional_notes: z.string().trim().max(2000).optional().or(z.literal('')),
  honeypot: z.string().optional().or(z.literal('')),
})

export type CareerApplicationFormData = z.infer<typeof careerApplicationSchema>
