import { documentSigningGateway } from '#server/modules/document-signing/document-signing.gateway'
import { readRequiredMultipartFormData } from '#server/shared/http/multipart-form-data'

export default defineEventHandler(async (event) => {
    const formData = await readRequiredMultipartFormData(event)

    if (!formData.has('file')) {
        throw createError({
            statusCode: 400,
            statusMessage: 'PDF file is required',
        })
    }

    const signedPdf = await documentSigningGateway.signPdf(event, formData)

    setHeader(event, 'content-type', 'application/pdf')
    setHeader(
        event,
        'content-disposition',
        'attachment; filename="signed-document.pdf"',
    )

    return signedPdf
})
