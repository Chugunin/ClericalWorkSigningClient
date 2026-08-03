import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { analyzeArchitecture } from '../../scripts/architecture/analyzer.mjs'

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'cw-architecture-'))
  for (const [path, content] of Object.entries(files)) {
    const fullPath = join(root, path)
    mkdirSync(join(fullPath, '..'), { recursive: true })
    writeFileSync(fullPath, content)
  }
  return root
}

function withFixture(files, assertion) {
  const root = fixture(files)
  try { assertion(analyzeArchitecture(root)) } finally { rmSync(root, { recursive: true, force: true }) }
}

test('rejects shared to module dependency', () => withFixture({
  'app/modules/auth/index.ts': "export const auth = true\n",
  'app/shared/api/client.ts': "import { auth } from '~/modules/auth'\n",
}, ({ violations }) => assert.ok(violations.some((item) => item.includes('shared layer imports module')))))

test('rejects bypass of another module public API', () => withFixture({
  'app/modules/auth/index.ts': "export const auth = true\n",
  'app/modules/documents/index.ts': "export const documents = true\n",
  'app/modules/documents/model/useDocuments.ts': "import { auth } from '~/modules/auth/model/auth'\n",
}, ({ violations }) => assert.ok(violations.some((item) => item.includes('bypasses public API')))))

test('detects module dependency cycle', () => withFixture({
  'app/modules/auth/index.ts': "export { documents } from '~/modules/documents'\n",
  'app/modules/documents/index.ts': "export { auth } from '~/modules/auth'\n",
}, ({ violations }) => assert.ok(violations.some((item) => item.includes('dependency cycle')))))

test('accepts valid one-way public dependency', () => withFixture({
  'app/modules/auth/index.ts': "export const auth = true\n",
  'app/modules/documents/index.ts': "export { auth } from '~/modules/auth'\nexport const documents = true\n",
  'app/pages/documents.vue': "<template><div /></template>\n",
}, ({ violations }) => assert.deepEqual(violations, [])))
