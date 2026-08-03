import assert from 'node:assert/strict'
import test from 'node:test'

import { mapDocumentCreateFormToRequest } from '../../app/modules/document-create/mappers/document-create.mapper.ts'

test('maps UI form model to transport DTO without leaking DateValue', () => {
  const request = mapDocumentCreateFormToRequest({
    name: '  Приказ  ',
    date: { toString: () => '2026-08-03' },
    description: '  Описание  ',
    statusId: 2,
    originId: 3,
    executorId: 15,
    signerIds: [{ signerId: 10, roleId: 4 }],
    files: [{ fileEntryId: 'file-id', typeId: 1 }],
  })

  assert.deepEqual(request, {
    Name: 'Приказ',
    CreatedDate: '2026-08-03',
    Description: 'Описание',
    StatusId: 2,
    OriginId: 3,
    Comments: [],
    Files: [{ FileEntryId: 'file-id', TypeId: 1 }],
    Records: [{ PersonId: 10, RoleId: 4, DecisionId: 0 }],
  })
})

test('maps optional collections to stable empty arrays', () => {
  const request = mapDocumentCreateFormToRequest({ name: 'Документ' })
  assert.deepEqual(request.Files, [])
  assert.deepEqual(request.Records, [])
  assert.deepEqual(request.Comments, [])
})
