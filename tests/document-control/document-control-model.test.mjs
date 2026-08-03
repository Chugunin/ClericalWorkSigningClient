import assert from 'node:assert/strict'
import test from 'node:test'
import {
  hasControlFilters,
  paginateControlDocuments,
  resetControlFilters,
} from '../../app/modules/document-control/model/document-control.model.ts'

const emptyFilters = () => ({
  SearchText: '', DateSince: undefined, DateTill: undefined, StatusIds: [], ExecutorIds: [],
})

test('filter indicator ignores whitespace and detects supported filters', () => {
  assert.equal(hasControlFilters({ ...emptyFilters(), SearchText: '   ' }), false)
  assert.equal(hasControlFilters({ ...emptyFilters(), SearchText: 'doc' }), true)
  assert.equal(hasControlFilters({ ...emptyFilters(), StatusIds: [1] }), true)
  assert.equal(hasControlFilters({ ...emptyFilters(), ExecutorIds: [2] }), true)
  assert.equal(hasControlFilters({ ...emptyFilters(), DateSince: '2026-01-01' }), true)
})

test('reset restores the established empty filter state', () => {
  const filters = { SearchText: 'x', DateSince: 'a', DateTill: 'b', StatusIds: [1], ExecutorIds: [2] }
  resetControlFilters(filters)
  assert.deepEqual(filters, emptyFilters())
})

test('pagination clamps page and provides display range', () => {
  const documents = Array.from({ length: 23 }, (_, Id) => ({ Id }))
  assert.deepEqual(paginateControlDocuments(documents, 2, 10), {
    items: documents.slice(10, 20), total: 23, from: 11, to: 20, maxPage: 3,
  })
  const clamped = paginateControlDocuments(documents, 99, 10)
  assert.deepEqual(clamped.items, documents.slice(20, 23))
  assert.equal(clamped.from, 21)
  assert.equal(clamped.to, 23)
})

test('empty pagination uses a stable zero range', () => {
  assert.deepEqual(paginateControlDocuments([], 1, 10), {
    items: [], total: 0, from: 0, to: 0, maxPage: 1,
  })
})
