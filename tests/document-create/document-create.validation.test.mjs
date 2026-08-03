import assert from 'node:assert/strict'
import test from 'node:test'

import { validateDocumentCreateForm } from '../../app/modules/document-create/lib/document-create.validation.ts'

test('returns errors for required create-document fields', () => {
  const messages = validateDocumentCreateForm({ name: ' ' })
  assert.deepEqual(messages.map(message => message.text), [
    'Укажите название документа',
    'Выберите тип документа',
    'Выберите исполнителя',
    'Добавьте хотя бы одного согласующего',
    'Добавьте хотя бы один файл',
  ])
  assert.ok(messages.every(message => message.level === 'error'))
})

test('accepts a complete form', () => {
  const messages = validateDocumentCreateForm({
    name: 'Документ',
    originId: 1,
    executorId: 2,
    signerIds: [{ signerId: 3, roleId: 4 }],
    files: [{ fileEntryId: 'id', typeId: 1 }],
  })
  assert.deepEqual(messages, [])
})
