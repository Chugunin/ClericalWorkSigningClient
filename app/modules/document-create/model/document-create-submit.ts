import type { CreateDocumentRequestData } from '#shared/contracts/documents/create-document.request'
import type { Document } from '#shared/contracts/documents/document.contract'
import type { DocumentFormModel } from './document-create-form.model'

export interface DocumentCreateSubmitDependencies {
  createDocument: (request: CreateDocumentRequestData) => Promise<Document>
  mapFormToRequest: (form: DocumentFormModel) => CreateDocumentRequestData
}

export function createDocumentSubmitter(
  dependencies: DocumentCreateSubmitDependencies,
) {
  return async function submitDocumentCreateForm(
    form: DocumentFormModel,
  ): Promise<Document> {
    return dependencies.createDocument(dependencies.mapFormToRequest(form))
  }
}
