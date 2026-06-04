'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { updateLeadStatus } from '@/app/actions/admin-leads'
import type { Database } from '@/lib/types/database' 

type Lead = Database['public']['Tables']['leads']['Row']
type LeadStatus = Lead['status']

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-blue-950/50', text: 'text-blue-300', label: 'New' },
  contacted: { bg: 'bg-amber-950/50', text: 'text-amber-300', label: 'Contacted' },
  booked: { bg: 'bg-green-950/50', text: 'text-green-300', label: 'Booked' },
  closed: { bg: 'bg-slate-700/50', text: 'text-slate-300', label: 'Closed' },
}

const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'booked', 'closed']

function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '—'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
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

interface LeadsTableProps {
  leads: Lead[]
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  currentSearch: string
  currentStatus: string
}

export default function LeadsTable({
  leads,
  page,
  totalPages,
  totalCount,
  pageSize,
  currentSearch,
  currentStatus,
}: LeadsTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(currentSearch)
  const [statusFilter, setStatusFilter] = useState(currentStatus)
  const [optimisticLeads, setOptimisticLeads] = useState<Lead[]>(leads)

  // Sync optimistic leads when server data changes (e.g. after search/pagination)
  useEffect(() => {
    setOptimisticLeads(leads)
  }, [leads])

  function handleSearch() {
    const params = new URLSearchParams()
    params.set('page', '1')
    if (searchInput) params.set('search', searchInput)
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
    router.push(`/admin/leads?${params.toString()}`)
  }

  function handleStatusFilterChange(newStatus: string) {
    setStatusFilter(newStatus)
    const params = new URLSearchParams()
    params.set('page', '1')
    if (searchInput) params.set('search', searchInput)
    if (newStatus && newStatus !== 'all') params.set('status', newStatus)
    router.push(`/admin/leads?${params.toString()}`)
  }

  function handleStatusChange(leadId: string, newStatus: LeadStatus) {
    // Optimistic update
    setOptimisticLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
    )

    startTransition(async () => {
      try {
        await updateLeadStatus(leadId, newStatus)
      } catch (error) {
        // Revert on error
        setOptimisticLeads(leads)
        console.error('Failed to update lead status:', error)
      }
    })
  }

  function handlePrevPage() {
    if (page > 1) {
      const params = new URLSearchParams()
      params.set('page', String(page - 1))
      if (searchInput) params.set('search', searchInput)
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
      router.push(`/admin/leads?${params.toString()}`)
    }
  }

  function handleNextPage() {
    if (page < totalPages) {
      const params = new URLSearchParams()
      params.set('page', String(page + 1))
      if (searchInput) params.set('search', searchInput)
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
      router.push(`/admin/leads?${params.toString()}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 flex-1 sm:flex-row sm:items-end">
          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-luxury-ivory font-outfit text-xs mb-2">
              Search
            </label>
            <div className="flex gap-2">
              <input
                id="search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
                placeholder="Name, email, phone..."
                className="flex-1 px-3 py-2 bg-luxury-charcoal border border-luxury-graphite text-luxury-ivory placeholder-luxury-graphite font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
                disabled={isPending}
              />
              <button
                onClick={handleSearch}
                disabled={isPending}
                className="px-4 py-2 bg-luxury-amber text-luxury-midnight font-outfit font-semibold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                Go
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:ml-4">
            <label htmlFor="status" className="block text-luxury-ivory font-outfit text-xs mb-2">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              disabled={isPending}
              className="px-3 py-2 bg-luxury-charcoal border border-luxury-graphite text-luxury-ivory font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="booked">Booked</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-luxury-graphite overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-luxury-charcoal border-b border-luxury-graphite">
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-pearl tracking-luxury">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-pearl tracking-luxury">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-pearl tracking-luxury">
                  Phone
                </th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-pearl tracking-luxury">
                  Service
                </th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-pearl tracking-luxury">
                  Message
                </th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-pearl tracking-luxury">
                  Source
                </th>
                <th className="px-4 py-3 text-left font-outfit text-xs font-semibold text-luxury-pearl tracking-luxury">
                  Submitted
                </th>
                <th className="px-4 py-3 text-center font-outfit text-xs font-semibold text-luxury-pearl tracking-luxury">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {optimisticLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-luxury-graphite">
                    <p className="font-outfit text-sm">No leads found</p>
                  </td>
                </tr>
              ) : (
                optimisticLeads.map((lead) => {
                  const isExpanded = expandedId === lead.id
                  const statusColor = STATUS_COLORS[lead.status]

                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-luxury-graphite/50 hover:bg-luxury-charcoal/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    >
                      <td className="px-4 py-3 text-luxury-ivory font-outfit text-sm">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-luxury-pearl font-outfit text-sm">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3 text-luxury-pearl font-outfit text-sm">
                        {lead.phone || '—'}
                      </td>
                      <td className="px-4 py-3 text-luxury-pearl font-outfit text-sm">
                        {lead.service_interest || '—'}
                      </td>
                      <td
                        className="px-4 py-3 text-luxury-pearl font-outfit text-sm"
                        title={lead.message || undefined}
                      >
                        {truncateText(lead.message, 60)}
                      </td>
                      <td className="px-4 py-3 text-luxury-pearl font-outfit text-sm">
                        {lead.source_page || '—'}
                      </td>
                      <td
                        className="px-4 py-3 text-luxury-pearl font-outfit text-sm"
                        title={new Date(lead.created_at).toLocaleString()}
                      >
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          disabled={isPending}
                          value={lead.status}
                          className={`px-2 py-1 rounded font-outfit text-xs font-semibold appearance-none cursor-pointer ${statusColor.bg} ${statusColor.text} hover:opacity-80 transition-opacity disabled:opacity-50 border-none outline-none focus:ring-1 focus:ring-luxury-amber text-center`}
                          title="Change status"
                        >
                          <option value="new" className="bg-luxury-charcoal text-blue-300">New</option>
                          <option value="contacted" className="bg-luxury-charcoal text-amber-300">Contacted</option>
                          <option value="booked" className="bg-luxury-charcoal text-green-300">Booked</option>
                          <option value="closed" className="bg-luxury-charcoal text-slate-300">Closed</option>
                        </select>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Expanded Details Slide-Over */}
        {expandedId && (
          <div className="border-t border-luxury-graphite bg-luxury-charcoal/50 p-4 sm:p-6">
            {(() => {
              const lead = optimisticLeads.find((l) => l.id === expandedId)
              if (!lead) return null

              return (
                <div className="max-w-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-playfair text-xl font-bold text-luxury-ivory">
                      Lead Details
                    </h3>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="text-luxury-pearl hover:text-luxury-ivory transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="font-outfit text-xs text-luxury-pearl mb-1 tracking-luxury">
                        Name
                      </p>
                      <p className="font-outfit text-sm text-luxury-ivory">{lead.name}</p>
                    </div>

                    <div>
                      <p className="font-outfit text-xs text-luxury-pearl mb-1 tracking-luxury">
                        Email
                      </p>
                      <p className="font-outfit text-sm text-luxury-ivory break-all">{lead.email}</p>
                    </div>

                    <div>
                      <p className="font-outfit text-xs text-luxury-pearl mb-1 tracking-luxury">
                        Phone
                      </p>
                      <p className="font-outfit text-sm text-luxury-ivory">{lead.phone || '—'}</p>
                    </div>

                    <div>
                      <p className="font-outfit text-xs text-luxury-pearl mb-1 tracking-luxury">
                        Service Interest
                      </p>
                      <p className="font-outfit text-sm text-luxury-ivory">
                        {lead.service_interest || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="font-outfit text-xs text-luxury-pearl mb-1 tracking-luxury">
                        Source Page
                      </p>
                      <p className="font-outfit text-sm text-luxury-ivory">{lead.source_page || '—'}</p>
                    </div>

                    <div>
                      <p className="font-outfit text-xs text-luxury-pearl mb-1 tracking-luxury">
                        Submitted
                      </p>
                      <p className="font-outfit text-sm text-luxury-ivory">
                        {new Date(lead.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="font-outfit text-xs text-luxury-pearl mb-1 tracking-luxury">
                        Status
                      </p>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        disabled={isPending}
                        className={`px-3 py-1.5 rounded font-outfit text-sm font-semibold cursor-pointer ${STATUS_COLORS[lead.status].bg} ${STATUS_COLORS[lead.status].text} hover:opacity-80 transition-opacity disabled:opacity-50 border-none outline-none focus:ring-1 focus:ring-luxury-amber`}
                      >
                        <option value="new" className="bg-luxury-charcoal text-blue-300">New</option>
                        <option value="contacted" className="bg-luxury-charcoal text-amber-300">Contacted</option>
                        <option value="booked" className="bg-luxury-charcoal text-green-300">Booked</option>
                        <option value="closed" className="bg-luxury-charcoal text-slate-300">Closed</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 border-t border-luxury-graphite/50 pt-4 mt-2">
                      <p className="font-outfit text-xs text-luxury-pearl mb-1 tracking-luxury">
                        Message
                      </p>
                      <p className="font-outfit text-sm text-luxury-ivory whitespace-pre-wrap">
                        {lead.message || '—'}
                      </p>
                    </div>

                    {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
                      <div className="sm:col-span-2 border-t border-luxury-graphite/50 pt-4 mt-2">
                        <p className="font-outfit text-xs text-luxury-pearl mb-3 tracking-luxury">
                          UTM Parameters
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {lead.utm_source && (
                            <div>
                              <p className="font-outfit text-xs text-luxury-graphite mb-1">Source</p>
                              <p className="font-outfit text-sm text-luxury-ivory">{lead.utm_source}</p>
                            </div>
                          )}
                          {lead.utm_medium && (
                            <div>
                              <p className="font-outfit text-xs text-luxury-graphite mb-1">Medium</p>
                              <p className="font-outfit text-sm text-luxury-ivory">{lead.utm_medium}</p>
                            </div>
                          )}
                          {lead.utm_campaign && (
                            <div>
                              <p className="font-outfit text-xs text-luxury-graphite mb-1">
                                Campaign
                              </p>
                              <p className="font-outfit text-sm text-luxury-ivory">
                                {lead.utm_campaign}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-luxury-pearl font-outfit text-sm">
          Page {page} of {totalPages || 1} ({totalCount} total)
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1 || isPending}
            className="flex items-center gap-2 px-3 py-2 border border-luxury-graphite text-luxury-pearl hover:border-luxury-amber hover:text-luxury-amber transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            <span className="font-outfit text-sm">Previous</span>
          </button>

          <button
            onClick={handleNextPage}
            disabled={page >= totalPages || isPending}
            className="flex items-center gap-2 px-3 py-2 border border-luxury-graphite text-luxury-pearl hover:border-luxury-amber hover:text-luxury-amber transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="font-outfit text-sm">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
