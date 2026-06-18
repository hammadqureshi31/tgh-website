'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, FileText, Instagram, Mail, Phone, Save } from 'lucide-react'
import {
  updateApplicationStatus,
  updateApplicationNotes,
} from '@/app/actions/admin-recruitment'
import { JOB_APPLICATION_STATUSES } from '@/lib/types/database'
import type { JobApplication, JobApplicationStatus } from '@/lib/types/database'
import { STATUS_COLORS } from './RecruitmentTable'

interface ApplicationDetailProps {
  application: JobApplication
}

export default function ApplicationDetail({ application }: ApplicationDetailProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<JobApplicationStatus>(application.status)
  const [notes, setNotes] = useState(application.review_notes || '')
  const [notesSaved, setNotesSaved] = useState(false)

  function handleStatusChange(newStatus: JobApplicationStatus) {
    setStatus(newStatus)
    startTransition(async () => {
      try {
        await updateApplicationStatus(application.id, newStatus)
        router.refresh()
      } catch (error) {
        setStatus(application.status)
        console.error('Failed to update status:', error)
      }
    })
  }

  function handleSaveNotes() {
    startTransition(async () => {
      try {
        await updateApplicationNotes(application.id, notes)
        setNotesSaved(true)
        setTimeout(() => setNotesSaved(false), 2500)
        router.refresh()
      } catch (error) {
        console.error('Failed to save notes:', error)
      }
    })
  }

  const portfolioUrls = Array.isArray(application.portfolio_urls) ? application.portfolio_urls : []

  return (
    <div className="min-h-screen pt-20 bg-luxury-ivory">
      <div className="border-b border-black/10 bg-white/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <button
            onClick={() => router.push('/dashboard/recruitment')}
            className="inline-flex items-center gap-2 text-luxury-graphite/60 hover:text-luxury-amber transition-colors mb-4 font-outfit text-sm"
          >
            <ArrowLeft size={16} />
            Back to Recruitment
          </button>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-luxury-midnight mb-2">{application.full_name}</h1>
              <p className="text-luxury-graphite/70 font-outfit text-sm tracking-luxury">
                {application.position_applied} — {application.preferred_location}
              </p>
            </div>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as JobApplicationStatus)}
              disabled={isPending}
              className={`px-4 py-2 font-outfit text-sm font-semibold cursor-pointer ${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text} hover:opacity-80 transition-opacity disabled:opacity-50 border-none outline-none focus:ring-1 focus:ring-luxury-amber`}
            >
              {JOB_APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-white text-luxury-midnight">
                  {STATUS_COLORS[s].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Applicant Information */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="font-playfair text-xl text-luxury-midnight mb-5">Applicant Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white border border-black/10 p-6">
              <div>
                <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Email</p>
                <a
                  href={`mailto:${application.email}`}
                  className="font-outfit text-sm text-luxury-midnight hover:text-luxury-amber inline-flex items-center gap-2 break-all"
                >
                  <Mail size={14} className="text-luxury-amber shrink-0" />
                  {application.email}
                </a>
              </div>
              <div>
                <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Phone</p>
                <a
                  href={`tel:${application.phone}`}
                  className="font-outfit text-sm text-luxury-midnight hover:text-luxury-amber inline-flex items-center gap-2"
                >
                  <Phone size={14} className="text-luxury-amber shrink-0" />
                  {application.phone}
                </a>
              </div>
              <div>
                <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Years Experience</p>
                <p className="font-outfit text-sm text-luxury-midnight">{application.years_experience}</p>
              </div>
              <div>
                <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Current Shop</p>
                <p className="font-outfit text-sm text-luxury-midnight">{application.current_shop || '—'}</p>
              </div>
              {application.instagram_url && (
                <div className="sm:col-span-2">
                  <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Instagram</p>
                  <a
                    href={application.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-outfit text-sm text-luxury-midnight hover:text-luxury-amber inline-flex items-center gap-2 break-all"
                  >
                    <Instagram size={14} className="text-luxury-amber shrink-0" />
                    {application.instagram_url}
                  </a>
                </div>
              )}
              <div className="sm:col-span-2">
                <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Submitted</p>
                <p className="font-outfit text-sm text-luxury-midnight">
                  {new Date(application.created_at).toLocaleString()}
                </p>
              </div>
              {application.additional_notes && (
                <div className="sm:col-span-2 border-t border-black/10 pt-4">
                  <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Application Notes</p>
                  <p className="font-outfit text-sm text-luxury-midnight whitespace-pre-wrap">
                    {application.additional_notes}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-luxury-midnight mb-5">Resume</h2>
            <a
              href={application.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-black/10 hover:border-luxury-amber/40 transition-colors text-luxury-midnight font-outfit text-sm"
            >
              <FileText size={18} className="text-luxury-amber" />
              Download Resume
            </a>
          </section>

          {portfolioUrls.length > 0 && (
            <section>
              <h2 className="font-playfair text-xl text-luxury-midnight mb-5">Portfolio Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {portfolioUrls.map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square overflow-hidden border border-black/10 hover:border-luxury-amber/40 transition-colors"
                  >
                    <Image src={url} alt={`Portfolio photo ${i + 1}`} fill className="object-cover" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Review Notes / Status History */}
        <div className="space-y-10">
          <section>
            <h2 className="font-playfair text-xl text-luxury-midnight mb-5">Review Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              placeholder="Internal notes about this candidate..."
              className="w-full px-4 py-3 bg-white border border-black/15 text-luxury-midnight placeholder-luxury-graphite/40 font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors resize-none mb-3"
            />
            <button
              onClick={handleSaveNotes}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-luxury-amber text-luxury-midnight font-outfit font-semibold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <Save size={14} />
              {notesSaved ? 'Saved' : 'Save Notes'}
            </button>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-luxury-midnight mb-5">Status History</h2>
            <div className="bg-white border border-black/10 p-5 space-y-3">
              <div>
                <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Current Status</p>
                <span
                  className={`inline-block px-3 py-1 font-outfit text-xs font-semibold ${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text}`}
                >
                  {STATUS_COLORS[status].label}
                </span>
              </div>
              {application.reviewed_at && (
                <div>
                  <p className="font-outfit text-xs text-luxury-graphite/50 mb-1 tracking-luxury">Last Reviewed</p>
                  <p className="font-outfit text-sm text-luxury-midnight">
                    {new Date(application.reviewed_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
