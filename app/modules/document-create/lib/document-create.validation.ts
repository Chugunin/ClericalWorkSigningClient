import type { AppToastMessage } from '~/shared/composables'
import type { DocumentFormModel } from '../model/document-create-form.model'

export function validateDocumentCreateForm(
  form: DocumentFormModel,
): AppToastMessage[] {
  const messages: AppToastMessage[] = []

  if (!form.name?.trim()) {
    messages.push({ text: 'Укажите название документа', level: 'error' })
  }

  if (form.originId == null) {
    messages.push({ text: 'Выберите тип документа', level: 'error' })
  }

  if (form.executorId == null) {
    messages.push({ text: 'Выберите исполнителя', level: 'error' })
  }

  if (!(form.signerIds?.length)) {
    messages.push({ text: 'Добавьте хотя бы одного согласующего', level: 'error' })
  }

  if (!(form.files?.length)) {
    messages.push({ text: 'Добавьте хотя бы один файл', level: 'error' })
  }

  return messages
}
