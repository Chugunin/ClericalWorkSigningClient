export interface SigningFileReference {
  id: string
  originalName: string
}

export function getInitialSigningFile<T extends SigningFileReference>(files: readonly T[]): T | null {
  return files[0] ?? null
}

export function selectSigningFile<T extends SigningFileReference>(
  files: readonly T[],
  fileId: string | null | undefined,
): T | null {
  if (!fileId) return null
  return files.find(file => file.id === fileId) ?? null
}
