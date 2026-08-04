import type { PdfSignaturePlacement } from '#shared/contracts/document-signing/pdf-signing.contracts'

export interface SignatureStampSize {
  width: number
  height: number
}

export interface SignatureStampPosition {
  x: number
  y: number
}

export interface SignatureStampViewport {
  width: number
  height: number
  scale: number
}

export interface SignatureStampDomRect extends SignatureStampPosition {
  width: number
  height: number
}

export const DEFAULT_SIGNATURE_STAMP_SIZE: Readonly<SignatureStampSize> = {
  width: 180,
  height: 60,
}

function requirePositiveFinite(
  value: number,
  fieldName: string,
): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${fieldName} must be a positive finite number`)
  }

  return value
}

function normalizeCoordinate(value: number): number {
  return Number.isFinite(value) ? value : 0
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export function getSignatureStampDomSize(
  size: SignatureStampSize,
  scale: number,
): SignatureStampSize {
  const normalizedScale = requirePositiveFinite(scale, 'scale')

  return {
    width: requirePositiveFinite(size.width, 'stamp width') * normalizedScale,
    height: requirePositiveFinite(size.height, 'stamp height') * normalizedScale,
  }
}

export function clampSignatureStampPosition(
  position: SignatureStampPosition,
  size: SignatureStampSize,
  viewport: SignatureStampViewport,
): SignatureStampPosition {
  const viewportWidth = requirePositiveFinite(viewport.width, 'viewport width')
  const viewportHeight = requirePositiveFinite(viewport.height, 'viewport height')
  const stampDomSize = getSignatureStampDomSize(size, viewport.scale)

  const maximumX = Math.max(viewportWidth - stampDomSize.width, 0)
  const maximumY = Math.max(viewportHeight - stampDomSize.height, 0)

  return {
    x: clamp(normalizeCoordinate(position.x), 0, maximumX),
    y: clamp(normalizeCoordinate(position.y), 0, maximumY),
  }
}

export function getSignatureStampDomRect(
  position: SignatureStampPosition,
  size: SignatureStampSize,
  viewport: SignatureStampViewport,
): SignatureStampDomRect {
  const clampedPosition = clampSignatureStampPosition(
    position,
    size,
    viewport,
  )
  const domSize = getSignatureStampDomSize(size, viewport.scale)

  return {
    ...clampedPosition,
    ...domSize,
  }
}

export function toPdfSignaturePlacement(
  page: number,
  position: SignatureStampPosition,
  size: SignatureStampSize,
  viewport: SignatureStampViewport,
): PdfSignaturePlacement {
  const normalizedPage = Math.trunc(page)

  if (normalizedPage < 1) {
    throw new RangeError('page must be a positive integer')
  }

  const scale = requirePositiveFinite(viewport.scale, 'scale')
  const viewportHeight = requirePositiveFinite(
    viewport.height,
    'viewport height',
  )
  const clampedPosition = clampSignatureStampPosition(
    position,
    size,
    viewport,
  )
  const width = requirePositiveFinite(size.width, 'stamp width')
  const height = requirePositiveFinite(size.height, 'stamp height')
  const pageHeight = viewportHeight / scale

  return {
    page: normalizedPage,
    x: Math.round(clampedPosition.x / scale),
    y: Math.round(
      pageHeight
      - clampedPosition.y / scale
      - height,
    ),
    width: Math.round(width),
    height: Math.round(height),
  }
}
