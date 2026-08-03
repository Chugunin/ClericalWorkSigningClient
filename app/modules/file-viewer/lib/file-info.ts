export type FileKind =
    | 'image'
    | 'pdf'
    | 'word'
    | 'excel'
    | 'presentation'
    | 'text'
    | 'archive'
    | 'video'
    | 'audio'
    | 'unknown'

export type FileInfoSource =
    | File
    | string
    | {
    name?: string | null
    fileName?: string | null
    originalName?: string | null
    type?: string | null
    mimeType?: string | null
    contentType?: string | null
}

export const fileIconMap = {
    image: 'i-lucide-image',
    pdf: 'i-lucide-file-text',
    word: 'i-lucide-file-type',
    excel: 'i-lucide-sheet',
    presentation: 'i-lucide-presentation',
    text: 'i-lucide-file-code-2',
    archive: 'i-lucide-file-archive',
    video: 'i-lucide-file-video',
    audio: 'i-lucide-file-audio',
    unknown: 'i-lucide-file',
} as const

export const fileColorMap = {
    image: 'success',
    pdf: 'error',
    word: 'primary',
    excel: 'success',
    presentation: 'warning',
    text: 'neutral',
    archive: 'warning',
    video: 'primary',
    audio: 'secondary',
    unknown: 'neutral',
} as const

export function getExtension(name?: string | null) {
    if (!name) return ''

    const parts = name.split('.')

    if (parts.length <= 1) return ''
    if (parts.length === 2 && name.startsWith('.')) return ''

    return parts.pop()!.toLowerCase()
}

function getSourceName(file: FileInfoSource) {
    if (typeof file === 'string') return file

    if (file instanceof File) return file.name

    return (
        file.originalName ||
        file.fileName ||
        file.name ||
        ''
    )
}

function getSourceMimeType(file: FileInfoSource) {
    if (typeof file === 'string') return ''

    if (file instanceof File) return file.type

    return (
        file.mimeType ||
        file.contentType ||
        file.type ||
        ''
    )
}

export function getFileKindByMimeAndExtension(
    mimeType?: string | null,
    extension?: string | null,
): FileKind {
    const type = (mimeType ?? '').toLowerCase()
    const ext = (extension ?? '').toLowerCase()

    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'

    if (type === 'application/pdf') return 'pdf'

    if (
        type.includes('word') ||
        type.includes('msword') ||
        type.includes('officedocument.wordprocessingml')
    ) {
        return 'word'
    }

    if (
        type.includes('excel') ||
        type.includes('spreadsheet') ||
        type.includes('officedocument.spreadsheetml')
    ) {
        return 'excel'
    }

    if (
        type.includes('powerpoint') ||
        type.includes('presentation') ||
        type.includes('officedocument.presentationml')
    ) {
        return 'presentation'
    }

    if (type.startsWith('text/')) return 'text'

    switch (ext) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'webp':
        case 'bmp':
            return 'image'

        case 'pdf':
            return 'pdf'

        case 'doc':
        case 'docx':
        case 'rtf':
            return 'word'

        case 'xls':
        case 'xlsx':
        case 'csv':
            return 'excel'

        case 'ppt':
        case 'pptx':
            return 'presentation'

        case 'txt':
        case 'json':
        case 'xml':
        case 'md':
            return 'text'

        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return 'archive'

        case 'mp4':
        case 'avi':
        case 'mov':
        case 'webm':
            return 'video'

        case 'mp3':
        case 'wav':
        case 'ogg':
            return 'audio'
    }

    return 'unknown'
}

export function canPreviewFileKind(kind: FileKind) {
    return kind === 'pdf' || kind === 'image'
}

export function getFileInfo(file: FileInfoSource) {
    const name = getSourceName(file)
    const mimeType = getSourceMimeType(file)
    const ext = getExtension(name)
    const kind = getFileKindByMimeAndExtension(mimeType, ext)

    return {
        name,
        ext,
        mimeType,
        kind,
        icon: fileIconMap[kind],
        color: fileColorMap[kind],
        canPreview: canPreviewFileKind(kind),
    }
}