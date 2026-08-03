export type DocumentStatusColor = {
  bgClass: string
  textClass: string
  borderClass: string
  chartColor: string
}

const defaultColor: DocumentStatusColor = {
  bgClass: 'bg-gray-400/90',
  textClass: 'text-inverted',
  borderClass: 'border-gray-400/90',
  chartColor: '#9ca3af',
}

const documentStatusColors: Record<number, DocumentStatusColor> = {
  1: { bgClass: 'bg-blue-500/90', textClass: 'text-inverted', borderClass: 'border-blue-500/90', chartColor: '#3b82f6' },
  2: { bgClass: 'bg-yellow-500', textClass: 'text-inverted', borderClass: 'border-yellow-500/90', chartColor: '#eab308' },
  3: { bgClass: 'bg-green-500/90', textClass: 'text-inverted', borderClass: 'border-green-500/90', chartColor: '#22c55e' },
  4: { bgClass: 'bg-red-500/90', textClass: 'text-inverted', borderClass: 'border-red-500/90', chartColor: '#ef4444' },
  5: { bgClass: 'bg-emerald-500/90', textClass: 'text-inverted', borderClass: 'border-emerald-500/90', chartColor: '#10b981' },
  6: { bgClass: 'bg-amber-600', textClass: 'text-inverted', borderClass: 'border-amber-600/90', chartColor: '#d97706' },
  7: { bgClass: 'bg-green-800/90', textClass: 'text-inverted', borderClass: 'border-green-800/90', chartColor: '#166534' },
  8: { bgClass: 'bg-red-800', textClass: 'text-inverted', borderClass: 'border-red-800/90', chartColor: '#991b1b' },
  9: { bgClass: 'bg-emerald-800', textClass: 'text-inverted', borderClass: 'border-emerald-800/90', chartColor: '#065f46' },
}

export function getDocumentStatusColor(statusId?: number | null): DocumentStatusColor {
  return statusId == null ? defaultColor : documentStatusColors[statusId] ?? defaultColor
}
