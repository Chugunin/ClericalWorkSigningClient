import {computed, onBeforeUnmount, ref, watch, type Ref} from 'vue'
import type {DocumentFormFile} from "~/types/documents/create/form-model";
import type {FileEntry} from "#shared/types";

export interface UseFilesOptions {
    saveFile?: (file: File) => Promise<FileEntry>
}

export interface UseFilesReturn {
    mainFileKey: Ref<string | null>
    previewMap: Ref<Record<string, string>>

    hasFiles: Readonly<Ref<boolean>>
    mainFile: Readonly<Ref<File | null>>

    fileKey: (file: File) => string
    isMainFile: (file: File) => boolean
    getPreviewUrl: (file: File) => string | undefined

    markMainFile: (index: number) => void
    removeFile: (index: number) => void
    clearAll: () => void
    saveAll: () => Promise<DocumentFormFile[]>
}

export function useFiles(
    files: Ref<File[] | undefined>,
    options: UseFilesOptions = {},
): UseFilesReturn {
    const mainFileKey = ref<string | null>(null)
    const previewMap = ref<Record<string, string>>({})

    function fileKey(file: File): string {
        return `${file.name}_${file.size}_${file.lastModified}_${file.type}`
    }

    function isMainFile(file: File): boolean {
        return mainFileKey.value === fileKey(file)
    }

    function getPreviewUrl(file: File): string | undefined {
        return previewMap.value[fileKey(file)]
    }

    function getFileByIndex(index: number): File | null {
        const currentFiles = files.value ?? []
        return currentFiles[index] ?? null
    }

    function markMainFile(index: number): void {
        const file = getFileByIndex(index)
        if (!file) return

        mainFileKey.value = fileKey(file)
    }

    function removeFile(index: number): void {
        const currentFiles = files.value ?? []
        const fileToRemove = currentFiles[index]

        if (!fileToRemove) return

        const removedKey = fileKey(fileToRemove)
        const nextFiles = currentFiles.filter((_, i) => i !== index)

        files.value = nextFiles

        if (!nextFiles.length) {
            mainFileKey.value = null
            return
        }

        if (mainFileKey.value === removedKey) {
            const firstFile = nextFiles[0]
            mainFileKey.value = firstFile ? fileKey(firstFile) : null
        }
    }

    function clearAll(): void {
        files.value = []
        mainFileKey.value = null
    }

    const hasFiles = computed(() => (files.value?.length ?? 0) > 0)

    const mainFile = computed<File | null>(() => {
        const currentFiles = files.value ?? []
        if (!currentFiles.length || !mainFileKey.value) return null

        return currentFiles.find(f => fileKey(f) === mainFileKey.value) ?? null
    })

    watch(
        files,
        (newFiles = []) => {
            const nextPreviewMap: Record<string, string> = {}

            for (const file of newFiles) {
                const key = fileKey(file)

                if (previewMap.value[key]) {
                    nextPreviewMap[key] = previewMap.value[key]
                    continue
                }

                if (file.type.startsWith('image/')) {
                    nextPreviewMap[key] = URL.createObjectURL(file)
                }
            }

            for (const [key, url] of Object.entries(previewMap.value)) {
                if (!nextPreviewMap[key]) {
                    URL.revokeObjectURL(url)
                }
            }

            previewMap.value = nextPreviewMap
        },
        {deep: true, immediate: true},
    )

    watch(
        files,
        (newFiles = []) => {
            if (!newFiles.length) {
                mainFileKey.value = null
                return
            }

            const firstFile = newFiles[0]
            if (!firstFile) {
                mainFileKey.value = null
                return
            }

            if (!mainFileKey.value) {
                mainFileKey.value = fileKey(firstFile)
                return
            }

            const mainStillExists = newFiles.some(file => fileKey(file) === mainFileKey.value)

            if (!mainStillExists) {
                mainFileKey.value = fileKey(firstFile)
            }
        },
        {deep: true, immediate: true},
    )

    onBeforeUnmount(() => {
        for (const url of Object.values(previewMap.value)) {
            URL.revokeObjectURL(url)
        }
    })

    async function saveAll(): Promise<DocumentFormFile[]> {
        if (!options.saveFile) {
            throw new Error('saveFile handler is not provided')
        }

        const fileEntries: DocumentFormFile[] = []
        
        const currentFiles = files.value ?? []

        for (const currentFile of currentFiles) {

            try {
                const currentFileEntry = await options.saveFile(currentFile)
                
                if (currentFileEntry.Id) {
                    fileEntries.push(
                        {
                            fileEntryId: currentFileEntry.Id,
                            typeId: isMainFile(currentFile) ? 1 : 3
                        })
                }
                
            } catch (error) {
                throw error
            }
        }
        
        return fileEntries
    }

    return {
        mainFileKey,
        previewMap,

        hasFiles,
        mainFile,

        fileKey,
        isMainFile,
        getPreviewUrl,

        markMainFile,
        removeFile,
        clearAll,

        saveAll,
    }
}