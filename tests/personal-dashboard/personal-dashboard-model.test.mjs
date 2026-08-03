import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildPersonalDashboardModel,
  getNextDashboardSortDirection,
  invertDashboardStatuses,
  toggleDashboardStatus,
} from '../../app/modules/personal-dashboard/model/personal-dashboard.model.ts'

test('builds cards and status aggregates while hiding selected status cards', () => {
  const result = buildPersonalDashboardModel({
    documents: [
      { Id: '1', Name: 'B', CreatedDate: '2026-01-02', StatusId: 1, OriginId: 10, ExecutorId: 20 },
      { Id: '2', Name: 'A', CreatedDate: '2026-01-01', StatusId: 1, OriginId: 10, ExecutorId: 20 },
      { Id: '3', Name: 'Hidden', CreatedDate: '2026-01-03', StatusId: 2 },
      { Name: 'Without id', StatusId: 1 },
    ],
    statusTypes: [{ id: 1, Description: 'Создан' }, { id: 2, Description: 'Отправлен' }],
    originTypes: [{ id: 10, Description: 'Внутренний' }],
    persons: [{ id: 20, Name: 'Исполнитель' }],
    hiddenStatusIds: [2],
    sortDirection: 'asc',
    formatDate: value => String(value),
  })

  assert.deepEqual(result.chartItems.map(item => [item.statusId, item.count]), [[1, 2], [2, 1]])
  assert.deepEqual(result.cards.map(card => card.id), ['2', '1'])
  assert.equal(result.cards[0].originText, 'Внутренний')
  assert.equal(result.cards[0].executorText, 'Исполнитель')
})

test('status visibility operations are immutable and predictable', () => {
  const hidden = [1]
  assert.deepEqual(toggleDashboardStatus(hidden, 1), [])
  assert.deepEqual(toggleDashboardStatus(hidden, 2), [1, 2])
  assert.deepEqual(hidden, [1])

  const items = [
    { statusId: 1, label: 'A', count: 1, color: {} },
    { statusId: 2, label: 'B', count: 1, color: {} },
  ]
  assert.deepEqual(invertDashboardStatuses(items, [1]), [2])
})

test('sort direction cycles null, desc, asc, null', () => {
  assert.equal(getNextDashboardSortDirection(null), 'desc')
  assert.equal(getNextDashboardSortDirection('desc'), 'asc')
  assert.equal(getNextDashboardSortDirection('asc'), null)
})
