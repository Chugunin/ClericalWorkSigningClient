export interface ObjectUrlApi {
  createObjectURL(blob: Blob): string
  revokeObjectURL(url: string): void
}

export interface ObjectUrlResource {
  readonly url: string
  readonly mimeType: string
  readonly released: boolean
  release(): void
}

export function createObjectUrlResource(
  blob: Blob,
  urlApi: ObjectUrlApi = URL,
): ObjectUrlResource {
  const url = urlApi.createObjectURL(blob)
  let released = false

  return {
    url,
    mimeType: blob.type || 'application/octet-stream',
    get released() {
      return released
    },
    release() {
      if (released) return
      released = true
      urlApi.revokeObjectURL(url)
    },
  }
}
