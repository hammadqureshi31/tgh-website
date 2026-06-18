'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { JobApplication, JobApplicationStatus } from '@/lib/types/database'
import { JOB_APPLICATION_STATUSES } from '@/lib/types/database'

async function requireAdminUser() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login?next=/dashboard/recruitment')
  }
  return user
}

export interface GetApplicationsParams {
  page?: number
  search?: string
  status?: string
  position?: string
  location?: string
  dateFrom?: string
  dateTo?: string
}

export async function getApplications({
  page = 1,
  search = '',
  status = 'all',
  position = 'all',
  location = 'all',
  dateFrom = '',
  dateTo = '',
}: GetApplicationsParams): Promise<{
  applications: JobApplication[]
  totalCount: number
  page: number
  pageSize: number
}> {
  await requireAdminUser()

  const pageSize = 25
  const offset = (page - 1) * pageSize
  const adminClient = createAdminClient()

  let query = (adminClient as any).from('job_applications').select('*', { count: 'exact' })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (position && position !== 'all') {
    query = query.eq('position_applied', position)
  }
  if (location && location !== 'all') {
    query = query.eq('preferred_location', location)
  }
  if (dateFrom) {
    query = query.gte('created_at', dateFrom)
  }
  if (dateTo) {
    query = query.lte('created_at', dateTo)
  }
  if (search) {
    query = query.or(`full_name.ilike.*${search}*,email.ilike.*${search}*,phone.ilike.*${search}*`)
  }

  const {
    data: applications,
    count,
    error,
  } = await query.order('created_at', { ascending: false }).range(offset, offset + pageSize - 1)

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`)
  }

  return {
    applications: applications || [],
    totalCount: count || 0,
    page,
    pageSize,
  }
}

export async function getApplicationMetrics(): Promise<{
  total: number
  new: number
  interviewsScheduled: number
  offersSent: number
  hired: number
  rejected: number
}> {
  await requireAdminUser()
  const adminClient = createAdminClient()

  const counts = await Promise.all(
    [
      { key: 'total', filter: null },
      { key: 'new', filter: 'new' },
      { key: 'interviewsScheduled', filter: 'interview_scheduled' },
      { key: 'offersSent', filter: 'offer_sent' },
      { key: 'hired', filter: 'hired' },
      { key: 'rejected', filter: 'rejected' },
    ].map(async ({ key, filter }) => {
      let query = (adminClient as any)
        .from('job_applications')
        .select('id', { count: 'exact', head: true })
      if (filter) query = query.eq('status', filter)
      const { count } = await query
      return [key, count || 0] as const
    }),
  )

  return Object.fromEntries(counts) as {
    total: number
    new: number
    interviewsScheduled: number
    offersSent: number
    hired: number
    rejected: number
  }
}

export async function getApplicationById(id: string): Promise<JobApplication | null> {
  await requireAdminUser()
  const adminClient = createAdminClient()

  const { data, error } = await (adminClient as any)
    .from('job_applications')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116' || error.code === 'PGRST113') return null
    throw new Error(`Failed to fetch application: ${error.message}`)
  }

  return data
}

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: JobApplicationStatus,
): Promise<JobApplication> {
  const user = await requireAdminUser()

  if (!JOB_APPLICATION_STATUSES.includes(newStatus)) {
    throw new Error('Invalid status')
  }

  const adminClient = createAdminClient()
  const { data, error } = await (adminClient as any)
    .from('job_applications')
    .update({
      status: newStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update application status: ${error.message}`)
  }
  if (!data) {
    throw new Error('Application not found')
  }

  return data
}

export async function updateApplicationNotes(
  applicationId: string,
  reviewNotes: string,
): Promise<JobApplication> {
  const user = await requireAdminUser()
  const adminClient = createAdminClient()

  const { data, error } = await (adminClient as any)
    .from('job_applications')
    .update({
      review_notes: reviewNotes,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update review notes: ${error.message}`)
  }
  if (!data) {
    throw new Error('Application not found')
  }

  return data
}
