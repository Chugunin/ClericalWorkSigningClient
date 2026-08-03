import { filesApi } from '../api/files.api'
import { createObjectUrlResource, type ObjectUrlResource } from '../model/object-url-resource'

export async function loadPhysicalFile(
  fileId: string,
  signal?: AbortSignal,
): Promise<ObjectUrlResource> {
  const blob = await filesApi.fetchPhysicalFile(fileId, signal)
  return createObjectUrlResource(blob)
}
