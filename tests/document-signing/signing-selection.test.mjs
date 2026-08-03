import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getInitialSigningFile,
  selectSigningFile,
} from '../../app/modules/document-signing/model/signing-selection.ts'

const files = [
  { id: 'first', originalName: 'first.pdf' },
  { id: 'second', originalName: 'second.pdf' },
]

test('initial selection is the first file', () => {
  assert.equal(getInitialSigningFile(files), files[0])
})

test('empty file list has no selection', () => {
  assert.equal(getInitialSigningFile([]), null)
})

test('file selection resolves only an existing identifier', () => {
  assert.equal(selectSigningFile(files, 'second'), files[1])
  assert.equal(selectSigningFile(files, 'missing'), null)
  assert.equal(selectSigningFile(files, null), null)
})
