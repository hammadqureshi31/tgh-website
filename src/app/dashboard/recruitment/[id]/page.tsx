import { notFound } from 'next/navigation'
import { getApplicationById } from '@/app/actions/admin-recruitment'
import ApplicationDetail from '@/components/admin/ApplicationDetail'

export const metadata = {
  title: "Application Detail | The Gentry's House",
  robots: 'noindex, nofollow',
}

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params
  const application = await getApplicationById(id)

  if (!application) {
    notFound()
  }

  return <ApplicationDetail application={application} />
}
