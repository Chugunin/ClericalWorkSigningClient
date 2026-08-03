import type { CreateDocumentRequestData } from '#shared/contracts/documents/create-document.request'
import type { DocumentFormModel } from '../model/document-create-form.model'

export function mapDocumentCreateFormToRequest(
  form: DocumentFormModel,
): CreateDocumentRequestData {
  return {
    Name: form.name?.trim() ?? '',
    CreatedDate: form.date?.toString(),
    Description: form.description?.trim() || undefined,
    StatusId: form.statusId,
    OriginId: form.originId,
    Comments: [],
    Files: (form.files ?? []).map(file => ({
      FileEntryId: file.fileEntryId,
      TypeId: file.typeId,
    })),
    Records: (form.signerIds ?? []).map(signer => ({
      PersonId: signer.signerId,
      RoleId: signer.roleId,
      DecisionId: 0,
    })),
  }
}
