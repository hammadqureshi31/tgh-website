import { submitApplication } from '@/app/actions/careers'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const result = await submitApplication(formData)

    if (!result.success) {
      return Response.json(
        { error: result.error || 'Application failed', errors: result.errors },
        { status: 400 },
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('API careers/apply error:', error)
    return Response.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
