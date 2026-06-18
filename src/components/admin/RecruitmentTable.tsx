'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { updateApplicationStatus } from '@/app/actions/admin-recruitment'
import { JOB_APPLICATION_STATUSES } from '@/lib/types/database'
import type { JobApplication, JobApplicationStatus } from '@/lib/types/database'
import { CAREER_LOCATIONS, CAREER_POSITIONS } from '@/lib/careers'

export const STATUS_COLORS: Record<JobApplicationStatus, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-blue-950/50', text: 'text-blue-300', label: 'New' },
  reviewing: { bg: 'bg-amber-950/50', text: 'text-amber-300', label: 'Reviewing' },
  interview_scheduled: { bg: 'bg-purple-950/50', text: 'text-purple-300', label: 'Interview Scheduled' },
  interview_completed: { bg: 'bg-indigo-950/50', text: 'text-indigo-300', label: 'Interview Completed' },
  offer_sent: { bg: 'bg-cyan-950/50', text: 'text-cyan-300', label: 'Offer Sent' },
  hired: { bg: 'bg-green-950/50', text: 'text-green-300', label: 'Hired' },
  rejected: { bg: 'bg-red-950/50', text: 'text-red-300', label: 'Rejected' },
  archived: { bg: 'bg-slate-700/50', text: 'text-slate-300', label: 'Archived' },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface RecruitmentTableProps {
  applications: JobApplication[]
  page: number
  totalPages: number
  totalCount: number
  filters: {
    search: string
    status: string
    position: string
    location: string
    dateFrom: string
    dateTo: string
  }
}

export default function RecruitmentTable({
  applications,
  page,
  totalPages,
  totalCount,
  filters,
}: RecruitmentTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchInput, setSearchInput] = useState(filters.search)
  const [statusFilter, setStatusFilter] = useState(filters.status)
  const [positionFilter, setPositionFilter] = useState(filters.position)
  const [locationFilter, setLocationFilter] = useState(filters.location)
  const [dateFrom, setDateFrom] = useState(filters.dateFrom)
  const [dateTo, setDateTo] = useState(filters.dateTo)
  const [optimisticApplications, setOptimisticApplications] = useState(applications)

  useEffect(() => {
    setOptimisticApplications(applications)
  }, [applications])

  function pushParams(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams()
    params.set('page', overrides.page || '1')
    const search = overrides.search ?? searchInput
    const status = overrides.status ?? statusFilter
    const position = overrides.position ?? positionFilter
    const location = overrides.location ?? locationFilter
    const from = overrides.dateFrom ?? dateFrom
    const to = overrides.dateTo ?? dateTo

    if (search) params.set('search', search)
    if (status && status !== 'all') params.set('status', status)
    if (position && position !== 'all') params.set('position', position)
    if (location && location !== 'all') params.set('location', location)
    if (from) params.set('dateFrom', from)
    if (to) params.set('dateTo', to)

    router.push(`/dashboard/recruitment?${params.toString()}`)
  }

  function handleStatusChange(applicationId: string, newStatus: JobApplicationStatus) {
    setOptimisticApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)),
    )
    startTransition(async () => {
      try {
        await updateApplicationStatus(applicationId, newStatus)
      } catch (error) {
        setOptimisticApplications(applications)
        console.error('Failed to update application status:', error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-luxury-midnight font-outfit text-xs mb-2">
              Search
            </label>
            <div className="flex gap-2">
              <input
                id="search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') pushParams()
                }}
                placeholder="Name, email, phone..."
                className="flex-1 px-3 py-2 bg-white border border-black/15 text-luxury-midnight placeholder-luxury-graphite/40 font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
                disabled={isPending}
              />
              <button
                onClick={() => pushParams()}
                disabled={isPending}
                className="px-4 py-2 bg-luxury-amber text-luxury-midnight font-outfit font-semibold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                Go
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-luxury-midnight font-outfit text-xs mb-2">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                pushParams({ status: e.target.value })
              }}
              disabled={isPending}
              className="px-3 py-2 bg-white border border-black/15 text-luxury-midnight font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
            >
              <option value="all">All Statuses</option>
              {JOB_APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_COLORS[s].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="position" className="block text-luxury-midnight font-outfit text-xs mb-2">
              Position
            </label>
            <select
              id="position"
              value={positionFilter}
              onChange={(e) => {
                setPositionFilter(e.target.value)
                pushParams({ position: e.target.value })
              }}
              disabled={isPending}
              className="px-3 py-2 bg-white border border-black/15 text-luxury-midnight font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
            >
              <option value="all">All Positions</option>
              {CAREER_POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-luxury-midnight font-outfit text-xs mb-2">
              Location
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value)
                pushParams({ location: e.target.value })
              }}
              disabled={isPending}
              className="px-3 py-2 bg-white border border-black/15 text-luxury-midnight font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
            >
              <option value="all">All Locations</option>
              {CAREER_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div>
            <label htmlFor="dateFrom" className="block text-luxury-midnight font-outfit text-xs mb-2">
              From
            </label>
            <input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              onBlur={() => pushParams()}
              disabled={isPending}
              className="px-3 py-2 bg-white border border-black/15 text-luxury-midnight font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="block text-luxury-midnight font-outfit text-xs mb-2">
              To
            </label>
            <input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              onBlur={() => pushParams()}
              disabled={isPending}
              className="px-3 py-2 bg-white border border-black/15 text-luxury-midnight font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-black/10 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-luxury-ivory border-b border-black/10">
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-graphite tracking-luxury">Name</th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-graphite tracking-luxury">Position</th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-graphite tracking-luxury">Location</th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-graphite tracking-luxury">Experience</th>
                <th className="px-4 py-3 text-center font-outfit text-xs font-semibold text-luxury-graphite tracking-luxury">Status</th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-graphite tracking-luxury">Created</th>
                <th className="px-4 py-3 text-center font-outfit text-xs font-semibold text-luxury-graphite tracking-luxury">Actions</th>
              </tr>
            </thead>
            <tbody>
              {optimisticApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-luxury-graphite/40">
                    <p className="font-outfit text-sm">No applications found</p>
                  </td>
                </tr>
              ) : (
                optimisticApplications.map((app) => {
                  const statusColor = STATUS_COLORS[app.status]
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-black/10 hover:bg-luxury-ivory/60 transition-colors"
                    >
                      <td className="px-4 py-3 text-luxury-midnight font-outfit text-sm">{app.full_name}</td>
                      <td className="px-4 py-3 text-luxury-graphite/70 font-outfit text-sm">{app.position_applied}</td>
                      <td className="px-4 py-3 text-luxury-graphite/70 font-outfit text-sm">{app.preferred_location}</td>
                      <td className="px-4 py-3 text-luxury-graphite/70 font-outfit text-sm">
                        {app.years_experience} yr{app.years_experience === 1 ? '' : 's'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          onChange={(e) => handleStatusChange(app.id, e.target.value as JobApplicationStatus)}
                          disabled={isPending}
                          value={app.status}
                          className={`px-2 py-1 rounded font-outfit text-xs font-semibold appearance-none cursor-pointer ${statusColor.bg} ${statusColor.text} hover:opacity-80 transition-opacity disabled:opacity-50 border-none outline-none focus:ring-1 focus:ring-luxury-amber text-center`}
                          title="Change status"
                        >
                          {JOB_APPLICATION_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-white text-luxury-midnight">
                              {STATUS_COLORS[s].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td
                        className="px-4 py-3 text-luxury-graphite/70 font-outfit text-sm"
                        title={new Date(app.created_at).toLocaleString()}
                      >
                        {formatDate(app.created_at)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/dashboard/recruitment/${app.id}`}
                          className="inline-flex items-center gap-1.5 text-luxury-amber hover:text-luxury-whiskey transition-colors font-outfit text-xs"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-luxury-graphite/70 font-outfit text-sm">
          Page {page} of {totalPages || 1} ({totalCount} total)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => pushParams({ page: String(page - 1) })}
            disabled={page <= 1 || isPending}
            className="flex items-center gap-2 px-3 py-2 border border-black/15 text-luxury-graphite/70 hover:border-luxury-amber hover:text-luxury-amber transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            <span className="font-outfit text-sm">Previous</span>
          </button>
          <button
            onClick={() => pushParams({ page: String(page + 1) })}
            disabled={page >= totalPages || isPending}
            className="flex items-center gap-2 px-3 py-2 border border-black/15 text-luxury-graphite/70 hover:border-luxury-amber hover:text-luxury-amber transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="font-outfit text-sm">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
