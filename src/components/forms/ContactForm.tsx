'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStatus } from 'react-dom'
import { submitLead } from '@/app/actions/leads'
import { leadSchema, SERVICE_OPTIONS_DISPLAY, type LeadFormData } from '@/lib/validations/lead'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        w-full px-8 py-4 font-outfit font-semibold text-base tracking-wide
        transition-all duration-300 ease-out
        ${
          pending
            ? 'bg-luxury-graphite text-luxury-pearl/50 cursor-not-allowed'
            : 'bg-luxury-amber hover:bg-amber-600 text-luxury-midnight'
        }
        border border-luxury-amber/30
        flex items-center justify-center gap-2
      `}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Submitting...
        </>
      ) : (
        'Send Message'
      )}
    </button>
  )
}

interface FormError {
  message?: string
}

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error' | 'rate-limited'
  >('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur',
  })

  async function onSubmit(data: LeadFormData) {
    setServerError(null)
    setSubmitStatus('idle')

    const result = await submitLead(data)

    if (result.success) {
      setSubmitStatus('success')
      reset()
      // Auto-dismiss success message after 6 seconds
      setTimeout(() => setSubmitStatus('idle'), 6000)
    } else if ('error' in result) {
      if (result.error?.includes('Too many submissions')) {
        setSubmitStatus('rate-limited')
      } else {
        setSubmitStatus('error')
      }
      setServerError(result.error || 'Failed to submit. Please try again.')
    } else if ('errors' in result) {
      // Validation errors handled by form state
      setSubmitStatus('error')
    }
  }

  // Success state - replace form with message
  if (submitStatus === 'success') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-luxury-charcoal border border-luxury-amber/30 rounded-lg p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-luxury-amber" />
          </div>
          <h3 className="font-playfair text-2xl md:text-3xl text-luxury-ivory mb-4">
            Thank You
          </h3>
          <p className="text-luxury-pearl mb-2 font-outfit text-base leading-relaxed">
            Your message has been received.
          </p>
          <p className="text-luxury-pearl/70 font-outfit text-sm">
            We'll be in touch within 24 hours to discuss your grooming needs.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Server Error Banner */}
        {serverError && (
          <div className="bg-luxury-charcoal border border-red-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-outfit text-sm font-medium">{serverError}</p>
            </div>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block font-outfit text-sm font-semibold text-luxury-pearl mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Smith"
            {...register('name')}
            className={`
              w-full px-4 py-3 font-outfit text-base bg-luxury-graphite text-luxury-ivory
              border rounded-lg transition-all duration-300
              placeholder:text-luxury-pearl/40
              focus:outline-none focus:ring-2 focus:ring-luxury-amber/50 focus:border-luxury-amber
              ${errors.name ? 'border-red-500/50' : 'border-luxury-pearl/20'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-red-400 font-outfit text-xs">{(errors.name as FormError).message}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block font-outfit text-sm font-semibold text-luxury-pearl mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            className={`
              w-full px-4 py-3 font-outfit text-base bg-luxury-graphite text-luxury-ivory
              border rounded-lg transition-all duration-300
              placeholder:text-luxury-pearl/40
              focus:outline-none focus:ring-2 focus:ring-luxury-amber/50 focus:border-luxury-amber
              ${errors.email ? 'border-red-500/50' : 'border-luxury-pearl/20'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-red-400 font-outfit text-xs">{(errors.email as FormError).message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block font-outfit text-sm font-semibold text-luxury-pearl mb-2">
            Phone Number <span className="text-luxury-pearl/50">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            {...register('phone')}
            className={`
              w-full px-4 py-3 font-outfit text-base bg-luxury-graphite text-luxury-ivory
              border rounded-lg transition-all duration-300
              placeholder:text-luxury-pearl/40
              focus:outline-none focus:ring-2 focus:ring-luxury-amber/50 focus:border-luxury-amber
              ${errors.phone ? 'border-red-500/50' : 'border-luxury-pearl/20'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-red-400 font-outfit text-xs">{(errors.phone as FormError).message}</p>
          )}
        </div>

        {/* Service Interested In */}
        <div>
          <label htmlFor="service_interest" className="block font-outfit text-sm font-semibold text-luxury-pearl mb-2">
            Service Interested In <span className="text-luxury-pearl/50">(optional)</span>
          </label>
          <select
            id="service_interest"
            {...register('service_interest')}
            className={`
              w-full px-4 py-3 font-outfit text-base bg-luxury-graphite text-luxury-ivory
              border rounded-lg transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-luxury-amber/50 focus:border-luxury-amber
              ${errors.service_interest ? 'border-red-500/50' : 'border-luxury-pearl/20'}
              disabled:opacity-50 disabled:cursor-not-allowed
              appearance-none cursor-pointer
            `}
            disabled={isSubmitting}
          >
            <option value="">Select a service...</option>
            {SERVICE_OPTIONS_DISPLAY.map((service) => (
              <option key={service} value={service} className="bg-luxury-charcoal text-luxury-ivory">
                {service}
              </option>
            ))}
          </select>
          {errors.service_interest && (
            <p className="mt-1 text-red-400 font-outfit text-xs">{(errors.service_interest as FormError).message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block font-outfit text-sm font-semibold text-luxury-pearl mb-2">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Tell us about your grooming needs and how we can assist you..."
            rows={5}
            {...register('message')}
            className={`
              w-full px-4 py-3 font-outfit text-base bg-luxury-graphite text-luxury-ivory
              border rounded-lg transition-all duration-300 resize-none
              placeholder:text-luxury-pearl/40
              focus:outline-none focus:ring-2 focus:ring-luxury-amber/50 focus:border-luxury-amber
              ${errors.message ? 'border-red-500/50' : 'border-luxury-pearl/20'}
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[120px]
            `}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-red-400 font-outfit text-xs">{(errors.message as FormError).message}</p>
          )}
        </div>

        {/* Honeypot Field - Hidden */}
        <input
          type="hidden"
          {...register('honeypot')}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Submit Button */}
        <div>
          <SubmitButton />
        </div>

        {/* Trust Badge */}
        <p className="text-center text-luxury-pearl/50 font-outfit text-xs tracking-wide">
          We respect your privacy. Your information is secure and will never be shared.
        </p>
      </form>
    </div>
  )
}
