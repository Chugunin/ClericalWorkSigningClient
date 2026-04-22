import type {DocumentFormModel} from "~/types/documents/create/form-model";
import type {CreateDocumentRequestData} from "#shared/types/contracts/requests/documents/create-document-request-data";
import type {Document} from "#shared/types/contracts/responses/documents/document";

export function validateFormDocument(model: DocumentFormModel): AppToastMessage[] {
    const messages: AppToastMessage[] = []

    if (!model.name?.trim()) {
        messages.push({text: 'Укажите название документа', level: 'error'})
    }

    if (!model.date) {
        messages.push({text: 'Укажите дату документа', level: 'error'})
    }

    if (!model.executorId) {
        messages.push({text: 'Укажите исполнителя документа', level: 'error'})
    }

    if (!model.originId) {
        messages.push({text: 'Укажите тип документа', level: 'error'})
    }

    if (!model.signerIds || model.signerIds.length == 0) {
        messages.push({text: 'Укажите с кем документ согласовывается', level: 'error'})
    }

    if (!model.files?.length) {
        messages.push({text: 'Прикрепите файлы к документу', level: 'error'})
    }
    
    else if (!model.files.some(f => f.typeId === 1))
    {
        messages.push({text: 'Не выбран основной файл документа', level: 'error'})    
    }

    /*else {
        messages.push({text: model.signerIds.map(s => `[${s.signerId} - ${s.roleId}]`).join(", "), level: "info"})
    }*/

    if (!model.description) {
        messages.push({text: 'Укажите описание документа', level: 'warning'})
    }

    return messages
}

export async function saveFormDocument(model: DocumentFormModel): Promise<Document> {
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

    const files = model.files
        ? model.files.map(f => ({
            FileEntryId: f.fileEntryId,
            TypeId: f.typeId,
        }))
        : []

    const documentRequest: CreateDocumentRequestData = {
        Name: model.name!.trim(),
        CreatedDate: formatDateToISO(model.date),
        Description: model.description?.trim() || undefined,
        OriginId: model.originId,
        Comments: [],
        Files: files,
        Records: [...executorRecord, ...signerRecords],
    }

    const document = await createDocument(documentRequest)

    if (!document)
        throw new Error('Не удалось создать документ')

    return document
}