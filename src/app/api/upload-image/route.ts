import { uploadImage } from '@/app/actions/media'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const result = await uploadImage(formData)

    if (!result.success || !result.data) {
      return Response.json({ error: result.error || 'Upload failed' }, { status: 400 })
    }

    return Response.json({
      url: result.data.url,
      path: result.data.path,
    })
  } catch (error) {
    console.error('API upload error:', error)
    return Response.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
