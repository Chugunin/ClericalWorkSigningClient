import test from 'node:test'
import assert from 'node:assert/strict'
import { hasActiveFilters } from '../../app/modules/document-registry/lib/document-filters.ts'

test('empty document filters do not trigger POST filtering', () => {
  assert.equal(hasActiveFilters(undefined), false)
  assert.equal(hasActiveFilters(null), false)
  assert.equal(hasActiveFilters({}), false)
  assert.equal(hasActiveFilters({ SearchText: '  ', StatusIds: [], ExecutorIds: [] }), false)
})

test('each supported filter is recognized as active', () => {
  assert.equal(hasActiveFilters({ SearchText: 'report' }), true)
  assert.equal(hasActiveFilters({ StatusIds: [1] }), true)
  assert.equal(hasActiveFilters({ ExecutorIds: [2] }), true)
  assert.equal(hasActiveFilters({ DateSince: '2026-01-01' }), true)
  assert.equal(hasActiveFilters({ DateTill: '2026-01-31' }), true)
})
