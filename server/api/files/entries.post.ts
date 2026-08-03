import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { FileEntry } from '#shared/contracts/files/file-entry.contract'
import { filesGateway } from '#server/modules/files/files.gateway'

export default defineEventHandler(async (event): Promise<ApiResponse<FileEntry>> => {
  const formData = await readMultipartFormData(event)
  const file = formData?.find(part => part.name === 'file')

  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'Multipart form data is required' })
  }
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'File payload is required' })
  }

  return { success: true, data: await filesGateway.save(event, file) }
})
