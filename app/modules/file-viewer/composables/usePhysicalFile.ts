import { filesApi } from '../api/files.api'
import { createObjectUrlResource, type ObjectUrlResource } from '../model/object-url-resource'

export async function fetchFileBlob(
  fileId: string,
  signal?: AbortSignal,
): Promise<Blob> {
  return filesApi.fetchPhysicalFile(fileId, signal)
}

export async function loadPhysicalFile(
  fileId: string,
  signal?: AbortSignal,
): Promise<ObjectUrlResource> {
  const blob = await fetchFileBlob(fileId, signal)
  return createObjectUrlResource(blob)
}
