import {filesGateway} from "#server/modules/files/files.gateway.ts";

export default defineEventHandler(async (event) => {
  const fileId = getRouterParam(event, 'fileId')

  if (!fileId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File ID is required',
    })
  }

  const data = await filesGateway.getPhysicalFile(event, fileId)

  setHeader(event, 'content-type', 'application/octet-stream')

  return data
})