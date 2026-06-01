import { z } from 'zod'

const PHONE_PATTERN = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/

const SERVICE_OPTIONS = [
  'Haircut',
  'Beard Trim',
  'Hot Towel Shave',
  'Executive Grooming Package',
  'Consultation',
  'Other',
] as const

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),
  service_interest: z
    .enum(SERVICE_OPTIONS, {
      errorMap: () => ({ message: 'Please select a service' }),
    })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters'),
  honeypot: z.string().optional().or(z.literal('')),
})

export type LeadFormData = z.infer<typeof leadSchema>

export const SERVICE_OPTIONS_DISPLAY = SERVICE_OPTIONS
