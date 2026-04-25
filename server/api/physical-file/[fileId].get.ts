import {externalFileApi} from "#server/utils/external-file-api";

export default defineEventHandler(async (event) => {
    const {fileId} = getRouterParams(event)

    const response = await externalFileApi(
        event,
        `/api/files/GetPhysicalFile/${fileId}`,
    )

    const contentType =
        response.headers.get('content-type') ?? 'application/octet-stream'

    const contentDisposition = response.headers.get('content-disposition')

    setHeader(event, 'content-type', contentType)

    if (contentDisposition) {
        setHeader(event, 'content-disposition', contentDisposition)
    }

    return response.body
})