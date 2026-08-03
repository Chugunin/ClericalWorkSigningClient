/**
 * Координаты видимого штампа в системе координат PDF.
 *
 * Начало координат PDF находится в левом нижнем углу страницы.
 * Размеры и координаты передаются в PDF points.
 */
export interface PdfSignaturePlacement {
    page: number
    x: number
    y: number
    width: number
    height: number
}

/**
 * Метаданные multipart-запроса на подписание PDF.
 *
 * Сам файл передаётся отдельной частью FormData под ключом `file`.
 */
export interface SignPdfRequestData extends PdfSignaturePlacement {
    documentId?: string
    fileEntryId?: string
}

/**
 * Метаданные подписанного файла.
 *
 * Этот контракт потребуется, если backend возвращает JSON,
 * а не непосредственно application/pdf.
 */
export interface SignedPdfFile {
    fileEntryId?: string
    originalName: string
    mimeType: string
    size?: number
    downloadUrl?: string
}