import type { Document, DocumentFilters } from '~/modules/document-registry'

export interface PaginationSlice<T> {
  items: T[]
  total: number
  from: number
  to: number
  maxPage: number
}

export function hasControlFilters(filters: DocumentFilters): boolean {
  return Boolean(
    filters.SearchText?.trim()
    || filters.StatusIds?.length
    || filters.ExecutorIds?.length
    || filters.DateSince
    || filters.DateTill,
  )
}

export function resetControlFilters(filters: DocumentFilters): void {
  filters.SearchText = ''
  filters.DateSince = undefined
  filters.DateTill = undefined
  filters.StatusIds = []
  filters.ExecutorIds = []
}

export function paginateControlDocuments(
  documents: Document[],
  page: number,
  pageSize: number,
): PaginationSlice<Document> {
  const safePageSize = Math.max(1, pageSize)
  const total = documents.length
  const maxPage = Math.max(1, Math.ceil(total / safePageSize))
  const safePage = Math.min(Math.max(1, page), maxPage)
  const start = (safePage - 1) * safePageSize
  const items = documents.slice(start, start + safePageSize)

  return {
    items,
    total,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + safePageSize, total),
    maxPage,
  }
}
