import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const contractsRoot = join(root, 'shared/contracts')

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}

test('shared contracts do not depend on frameworks or application modules', () => {
  const forbidden = /from\s+['\"](?:vue|nuxt|pinia|@vue\/|@nuxt\/|#app|~\/|@\/)/
  for (const file of files(contractsRoot).filter((file) => file.endsWith('.ts'))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), forbidden, relative(root, file))
  }
})

test('legacy broad shared types barrel is removed', () => {
  assert.equal(existsSync(join(root, 'shared/types/index.ts')), false)
  for (const file of files(join(root, 'app')).concat(files(join(root, 'server'))).filter((file) => /\.(ts|vue)$/.test(file))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /#shared\/types(?:['\"]|\/)/, relative(root, file))
  }
})

test('create document request is JSON-safe and preserves required fields', async () => {
  const source = readFileSync(join(contractsRoot, 'documents/create-document.request.ts'), 'utf8')
  for (const field of ['Name: string', 'PersonId: number', 'FileEntryId: string', 'RoleId: number']) {
    assert.match(source, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }
  assert.doesNotMatch(source, /DateValue|CalendarDate|Ref<|ComputedRef|File\b/)
  const payload = { Name: 'Документ', CreatedDate: '2026-08-03', Files: [{ FileEntryId: 'f-1', TypeId: 2 }] }
  assert.deepEqual(JSON.parse(JSON.stringify(payload)), payload)
})

test('API response and document filters remain serializable transport contracts', () => {
  const api = readFileSync(join(contractsRoot, 'api/api-response.contract.ts'), 'utf8')
  const filters = readFileSync(join(contractsRoot, 'documents/document-filters.contract.ts'), 'utf8')
  assert.match(api, /success: boolean/)
  assert.match(api, /data: T/)
  assert.match(filters, /StatusIds\?: number\[\]/)
  assert.match(filters, /ExecutorIds\?: number\[\]/)
  assert.doesNotMatch(filters, /DateValue|Ref<|ComputedRef/)
})
