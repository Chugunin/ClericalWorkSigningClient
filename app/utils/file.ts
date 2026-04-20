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
    unknown: 'i-lucide-file'
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
    unknown: 'neutral'
} as const

export function getExtension(name: string) {
    const parts = name.split('.')

    if (parts.length <= 1) return ''
    if (parts.length === 2 && name.startsWith('.')) return ''

    return parts.pop()!.toLowerCase()
}

export function getFileInfo(file: File | string) {
    const name = typeof file === 'string' ? file : file.name
    const type = typeof file === 'string' ? '' : file.type

    const ext = getExtension(name)

    const kind: FileKind = (() => {
        // --- по mime ---
        if (type.startsWith('image/')) return 'image'
        if (type.startsWith('video/')) return 'video'
        if (type.startsWith('audio/')) return 'audio'

        if (type === 'application/pdf') return 'pdf'

        if (type.includes('word')) return 'word'
        if (type.includes('excel')) return 'excel'
        if (type.includes('powerpoint')) return 'presentation'

        if (type.startsWith('text/')) return 'text'

        // --- fallback по расширению ---
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
    })()

    return {
        name,
        ext,
        kind,
        icon: fileIconMap[kind],
        color: fileColorMap[kind]
    }
}