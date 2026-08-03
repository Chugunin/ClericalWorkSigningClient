import type {H3Event, MultiPartData} from 'h3'
import type {FileEntry} from '#shared/contracts/files/file-entry.contract'
import {requestExternalApi, requestExternalFile} from '#server/shared/external-api'

function toFormData(file: MultiPartData): FormData {
    const formData = new FormData()
    formData.append(
        'file',
        new Blob([new Uint8Array(file.data)], {type: file.type || 'application/octet-stream'}),
        file.filename || 'file',
    )
    return formData
}

export const filesGateway = {
    save(event: H3Event, file: MultiPartData): Promise<FileEntry> {
        return requestExternalApi<FileEntry>(event, '/api/files/SaveFileEntry', {
            method: 'POST',
            body: toFormData(file),
        })
    },

    async getPhysicalFile(
        event: H3Event,
        fileId: string,
    ): Promise<ArrayBuffer> {
        return requestExternalFile(
            event,
            `/api/files/GetPhysicalFile/${encodeURIComponent(fileId)}`,
        )
    },
}
