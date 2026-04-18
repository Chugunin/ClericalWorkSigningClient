import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {AppToastMessage} from "~/composables/useAppToast";

export function validateCreateForm(model: DocumentFormModel): AppToastMessage[] {
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

    /*else {
        messages.push({text: model.signerIds.map(s => `[${s.signerId} - ${s.roleId}]`).join(", "), level: "info"})
    }*/

    if (!model.description) {
        messages.push({text: 'Укажите описание документа', level: 'warning'})
    }

    return messages
}