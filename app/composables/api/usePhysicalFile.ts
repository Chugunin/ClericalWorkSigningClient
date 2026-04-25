export async function usePhysicalFile(fileId: string) {
    const blob = await $fetch<Blob>(`/api/physical-file/${fileId}`, {
        responseType: 'blob',
    })

    const url = URL.createObjectURL(blob)

    return {
        url,
        mimeType: blob.type,
    }
}