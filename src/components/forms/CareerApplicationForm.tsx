'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Upload,
  X,
  FileText,
  Check,
} from 'lucide-react'
import { submitApplication } from '@/app/actions/careers'
import {
  careerApplicationSchema,
  ALLOWED_RESUME_MIME_TYPES,
  ALLOWED_PORTFOLIO_MIME_TYPES,
  MAX_RESUME_SIZE,
  MAX_PORTFOLIO_FILE_SIZE,
  MAX_PORTFOLIO_FILES,
  type CareerApplicationFormData,
} from '@/lib/validations/career'
import { CAREER_LOCATIONS, CAREER_POSITIONS } from '@/lib/careers'
import { fieldClass, FieldLabel, FieldError, SuccessState } from './form-fields'
import { CAREERS_PREFILL_KEY } from '@/components/careers/CareersPositions'

const STEPS = [
  { id: 1, label: 'Personal Information' },
  { id: 2, label: 'Experience' },
  { id: 3, label: 'Portfolio & Resume' },
] as const

type StepFields = Record<number, (keyof CareerApplicationFormData)[]>

const STEP_FIELDS: StepFields = {
  1: ['full_name', 'phone', 'email', 'position_applied', 'preferred_location'],
  2: ['years_experience', 'instagram_url', 'current_shop', 'additional_notes'],
  3: [],
}

export default function CareerApplicationForm() {
  const [step, setStep] = useState(1)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([])
  const [portfolioError, setPortfolioError] = useState<string | null>(null)

  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CareerApplicationFormData>({
    resolver: zodResolver(careerApplicationSchema),
    mode: 'onBlur',
  })

  // Pre-fill position/location when arriving via an "Apply" button on an
  // open-positions card (see CareersPositions.tsx for the writer side).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CAREERS_PREFILL_KEY)
      if (raw) {
        const { position, location } = JSON.parse(raw)
        if (position) setValue('position_applied', position)
        if (location) setValue('preferred_location', location)
        sessionStorage.removeItem(CAREERS_PREFILL_KEY)
      }
    } catch {
      // ignore malformed/unavailable storage
    }
  }, [setValue])

  async function goNext() {
    const fieldsToValidate = STEP_FIELDS[step]
    const valid = fieldsToValidate.length === 0 ? true : await trigger(fieldsToValidate)
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1))
  }

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_RESUME_MIME_TYPES.includes(file.type)) {
      setResumeError('Please upload a PDF or Word document.')
      return
    }
    if (file.size > MAX_RESUME_SIZE) {
      setResumeError('File size exceeds 10MB limit.')
      return
    }
    setResumeError(null)
    setResumeFile(file)
  }

  function handlePortfolioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const combined = [...portfolioFiles, ...files]
    if (combined.length > MAX_PORTFOLIO_FILES) {
      setPortfolioError(`Please upload at most ${MAX_PORTFOLIO_FILES} photos.`)
      return
    }
    for (const file of files) {
      if (!ALLOWED_PORTFOLIO_MIME_TYPES.includes(file.type)) {
        setPortfolioError('Photos must be JPG, PNG, WebP, or AVIF images.')
        return
      }
      if (file.size > MAX_PORTFOLIO_FILE_SIZE) {
        setPortfolioError('Each photo must be under 10MB.')
        return
      }
    }
    setPortfolioError(null)
    setPortfolioFiles(combined)
    e.target.value = ''
  }

  function removePortfolioFile(index: number) {
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(data: CareerApplicationFormData) {
    setServerError(null)
    setSubmitStatus('idle')

    if (!resumeFile) {
      setResumeError('A resume upload is required.')
      return
    }

    const formData = new FormData()
    formData.append('full_name', data.full_name)
    formData.append('phone', data.phone)
    formData.append('email', data.email)
    formData.append('years_experience', String(data.years_experience))
    formData.append('instagram_url', data.instagram_url || '')
    formData.append('current_shop', data.current_shop || '')
    formData.append('position_applied', data.position_applied)
    formData.append('preferred_location', data.preferred_location)
    formData.append('additional_notes', data.additional_notes || '')
    formData.append('honeypot', data.honeypot || '')
    formData.append('resume', resumeFile)
    portfolioFiles.forEach((file) => formData.append('portfolio', file))

    const result = await submitApplication(formData)

    if (result.success) {
      setSubmitStatus('success')
      reset()
      setResumeFile(null)
      setPortfolioFiles([])
      setStep(1)
    } else {
      setSubmitStatus('error')
      setServerError(result.error || 'Failed to submit application. Please try again.')
    }
  }

  return (
    <section id="apply" className="bg-luxury-midnight py-24 md:py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 lg:px-12" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span className="font-mono text-luxury-amber text-xs uppercase" style={{ letterSpacing: '0.25em' }}>
              Apply Now
            </span>
            <div className="w-8 h-px bg-luxury-amber" />
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-ivory" style={{ lineHeight: '1.15' }}>
            Start Your <span className="italic text-luxury-amber">Application</span>
          </h2>
        </motion.div>

        {submitStatus === 'success' ? (
          <SuccessState
            eyebrow="Application Received"
            title="Thank You"
            description="Your application has been received. Our hiring team will review it and reach out if it's a fit."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Progress indicator */}
            <div className="flex items-center mb-10">
              {STEPS.map((s, idx) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={[
                        'w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0',
                        step > s.id
                          ? 'bg-luxury-amber border-luxury-amber text-luxury-midnight'
                          : step === s.id
                            ? 'border-luxury-amber text-luxury-amber'
                            : 'border-luxury-graphite text-luxury-pearl/30',
                      ].join(' ')}
                    >
                      {step > s.id ? <Check size={15} /> : <span className="font-outfit text-sm">{s.id}</span>}
                    </div>
                    <span
                      className={[
                        'font-mono text-[10px] uppercase text-center hidden sm:block',
                        step >= s.id ? 'text-luxury-pearl/60' : 'text-luxury-pearl/25',
                      ].join(' ')}
                      style={{ letterSpacing: '0.1em' }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-px mx-2 mb-5 sm:mb-6 bg-luxury-graphite relative overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{ scaleX: step > s.id ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-luxury-amber origin-left"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 px-5 py-4 border border-red-500/20 bg-red-500/5 mb-6"
                >
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="font-outfit text-red-400/80 text-sm">{serverError}</p>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1 — Personal Information */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px">
                      <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                        <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
                        <input
                          id="full_name"
                          type="text"
                          placeholder="James Thornton"
                          {...register('full_name')}
                          className={fieldClass(!!errors.full_name)}
                        />
                        <FieldError message={errors.full_name?.message} />
                      </div>

                      <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          {...register('phone')}
                          className={fieldClass(!!errors.phone)}
                        />
                        <FieldError message={errors.phone?.message} />
                      </div>
                    </div>

                    <div className="bg-luxury-charcoal px-6 pt-6 pb-6 mb-px">
                      <FieldLabel htmlFor="email">Email Address</FieldLabel>
                      <input
                        id="email"
                        type="email"
                        placeholder="james@example.com"
                        {...register('email')}
                        className={fieldClass(!!errors.email)}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px">
                      <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                        <FieldLabel htmlFor="position_applied">Position Applying For</FieldLabel>
                        <select
                          id="position_applied"
                          {...register('position_applied')}
                          className={[fieldClass(!!errors.position_applied), 'appearance-none cursor-pointer'].join(' ')}
                          style={{ backgroundColor: '#2D2D2D' }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select a position…
                          </option>
                          {CAREER_POSITIONS.map((p) => (
                            <option key={p} value={p} style={{ backgroundColor: '#1A1A1A' }}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <FieldError message={errors.position_applied?.message} />
                      </div>

                      <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                        <FieldLabel htmlFor="preferred_location">Preferred Location</FieldLabel>
                        <select
                          id="preferred_location"
                          {...register('preferred_location')}
                          className={[fieldClass(!!errors.preferred_location), 'appearance-none cursor-pointer'].join(' ')}
                          style={{ backgroundColor: '#2D2D2D' }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select a location…
                          </option>
                          {CAREER_LOCATIONS.map((loc) => (
                            <option key={loc.id} value={loc.name} style={{ backgroundColor: '#1A1A1A' }}>
                              {loc.name} ({loc.status})
                            </option>
                          ))}
                        </select>
                        <FieldError message={errors.preferred_location?.message} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 — Experience */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px">
                      <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                        <FieldLabel htmlFor="years_experience">Years Experience</FieldLabel>
                        <input
                          id="years_experience"
                          type="number"
                          min={0}
                          max={60}
                          placeholder="3"
                          {...register('years_experience')}
                          className={fieldClass(!!errors.years_experience)}
                        />
                        <FieldError message={errors.years_experience?.message} />
                      </div>

                      <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                        <FieldLabel htmlFor="instagram_url" optional>
                          Instagram Profile URL
                        </FieldLabel>
                        <input
                          id="instagram_url"
                          type="url"
                          placeholder="https://instagram.com/yourhandle"
                          {...register('instagram_url')}
                          className={fieldClass(!!errors.instagram_url)}
                        />
                        <FieldError message={errors.instagram_url?.message} />
                      </div>
                    </div>

                    <div className="bg-luxury-charcoal px-6 pt-6 pb-6 mb-px">
                      <FieldLabel htmlFor="current_shop" optional>
                        Current Shop
                      </FieldLabel>
                      <input
                        id="current_shop"
                        type="text"
                        placeholder="Where do you currently work?"
                        {...register('current_shop')}
                        className={fieldClass(!!errors.current_shop)}
                      />
                      <FieldError message={errors.current_shop?.message} />
                    </div>

                    <div className="bg-luxury-charcoal px-6 pt-6 pb-6 mb-px">
                      <FieldLabel htmlFor="additional_notes" optional>
                        Additional Notes
                      </FieldLabel>
                      <textarea
                        id="additional_notes"
                        placeholder="Anything else you'd like us to know…"
                        rows={4}
                        {...register('additional_notes')}
                        className={[fieldClass(!!errors.additional_notes), 'resize-none min-h-[110px]'].join(' ')}
                      />
                      <FieldError message={errors.additional_notes?.message} />
                    </div>
                  </motion.div>
                )}

                {/* Step 3 — Portfolio & Resume */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-luxury-charcoal px-6 pt-6 pb-6 mb-px">
                      <FieldLabel htmlFor="resume">Resume Upload</FieldLabel>
                      {resumeFile ? (
                        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-luxury-graphite border border-luxury-amber/20">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={16} className="text-luxury-amber shrink-0" />
                            <span className="font-outfit text-sm text-luxury-ivory truncate">{resumeFile.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResumeFile(null)}
                            className="text-luxury-pearl/50 hover:text-red-400 transition-colors shrink-0"
                            aria-label="Remove resume"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-3 px-4 py-6 border border-dashed border-luxury-graphite hover:border-luxury-amber/40 transition-colors cursor-pointer">
                          <Upload size={18} className="text-luxury-amber/60" />
                          <span className="font-outfit text-sm text-luxury-pearl/50">
                            Click to upload PDF or Word document (max 10MB)
                          </span>
                          <input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleResumeChange}
                            className="hidden"
                          />
                        </label>
                      )}
                      <FieldError message={resumeError || undefined} />
                    </div>

                    <div className="bg-luxury-charcoal px-6 pt-6 pb-6 mb-px">
                      <FieldLabel htmlFor="portfolio" optional>
                        Portfolio Photos Upload
                      </FieldLabel>
                      <label className="flex items-center justify-center gap-3 px-4 py-6 border border-dashed border-luxury-graphite hover:border-luxury-amber/40 transition-colors cursor-pointer mb-3">
                        <Upload size={18} className="text-luxury-amber/60" />
                        <span className="font-outfit text-sm text-luxury-pearl/50">
                          Click to upload up to {MAX_PORTFOLIO_FILES} photos (JPG, PNG, WebP — max 10MB each)
                        </span>
                        <input
                          id="portfolio"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          multiple
                          onChange={handlePortfolioChange}
                          disabled={portfolioFiles.length >= MAX_PORTFOLIO_FILES}
                          className="hidden"
                        />
                      </label>
                      {portfolioFiles.length > 0 && (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {portfolioFiles.map((file, i) => (
                            <li
                              key={`${file.name}-${i}`}
                              className="flex items-center justify-between gap-2 px-3 py-2 bg-luxury-graphite border border-luxury-graphite text-xs"
                            >
                              <span className="font-outfit text-luxury-ivory truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removePortfolioFile(i)}
                                className="text-luxury-pearl/50 hover:text-red-400 transition-colors shrink-0"
                                aria-label="Remove photo"
                              >
                                <X size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <FieldError message={portfolioError || undefined} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Honeypot — always present, hidden */}
              <input
                type="text"
                {...register('honeypot')}
                tabIndex={-1}
                autoComplete="off"
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                aria-hidden="true"
              />

              {/* Step navigation */}
              <div className="flex items-center justify-between gap-4 pt-8">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1 || isSubmitting}
                  className={[
                    'inline-flex items-center gap-2 px-6 py-3.5',
                    'font-outfit text-sm uppercase border transition-all duration-300',
                    step === 1
                      ? 'opacity-0 pointer-events-none'
                      : 'border-luxury-ivory/14 text-luxury-ivory/65 hover:border-luxury-amber hover:text-luxury-amber',
                  ].join(' ')}
                  style={{ letterSpacing: '0.1em' }}
                >
                  <ArrowLeft size={14} />
                  Back
                </button>

                {step < STEPS.length ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="group inline-flex items-center gap-3 px-10 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm uppercase hover:bg-luxury-whiskey hover:scale-105 transition-all duration-300"
                    style={{ letterSpacing: '0.12em' }}
                  >
                    Continue
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={[
                      'group flex items-center justify-center gap-3 px-10 py-4',
                      'font-outfit font-medium text-sm uppercase transition-all duration-300',
                      isSubmitting
                        ? 'bg-luxury-graphite text-luxury-pearl/30 cursor-not-allowed'
                        : 'bg-luxury-amber text-luxury-midnight hover:bg-luxury-whiskey hover:scale-105',
                    ].join(' ')}
                    style={{ letterSpacing: '0.12em' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                )}
              </div>
              <p
                className="font-mono text-luxury-pearl/25 text-xs leading-relaxed text-center mt-6"
                style={{ letterSpacing: '0.08em' }}
              >
                Your information and documents are kept private and reviewed only by our hiring team.
              </p>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  )
}
