import type {DocumentFormModel} from "~/types/documents/document-form-model";
import {formatDate} from "~/utils/date";
import type {CreateDocumentRequestData} from "#shared/types/contracts/requests/documents/create-document-request-data";
import type {Document} from "#shared/types/contracts/responses/documents/document";

export async function createNewDocument(model: DocumentFormModel): Promise<Document> {
    const executorRecord = model.executorId
        ? [{
            PersonId: model.executorId,
            RoleId: 1,
            DecisionId: 1,
        }]
        : []

    const signerRecords = model.signerIds
        ? model.signerIds.map(s => ({
            PersonId: s.signerId,
            RoleId: s.roleId,
            DecisionId: 1,
        }))
        : []

    const documentRequest: CreateDocumentRequestData = {
        Name: model.name!.trim(),
        CreatedDate: formatDateToISO(model.date),
        Description: model.description?.trim() || undefined,
        OriginId: model.originId,
        Comments: [],
        Files: [],
        Records: [...executorRecord, ...signerRecords],
    }

    const documentResponse = await createDocument(documentRequest)

    if (!documentResponse)
        throw new Error('Не удалось создать документ')

    return documentResponse
}