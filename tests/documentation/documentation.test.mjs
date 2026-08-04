import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { test } from 'node:test'

const requiredDocuments = [
  'README.md',
  'docs/architecture/ARCHITECTURE.md',
  'docs/architecture/MODULE_MAP.md',
  'docs/architecture/HOW_TO_ADD_MODULE.md',
  'docs/architecture/HOW_TO_ADD_PAGE.md',
  'docs/architecture/PUBLIC_API_RULES.md',
  'docs/architecture/DEVELOPMENT_WORKFLOW.md',
  'docs/architecture/CODE_REVIEW_CHECKLIST.md',
  'docs/architecture/MODULAR_ARCHITECTURE_ROADMAP.md',
  'docs/architecture/DOCUMENT_SIGNING.md',
]

async function read(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test('required architecture documentation exists and is not empty', async () => {
  for (const path of requiredDocuments) {
    const url = new URL(`../../${path}`, import.meta.url)
    const info = await stat(url)
    assert.ok(info.isFile(), `${path} must be a file`)
    assert.ok(info.size > 200, `${path} is unexpectedly small`)
  }
})

test('root README links the operational architecture guides', async () => {
  const source = await read('README.md')
  for (const document of requiredDocuments.slice(1, 8)) {
    assert.match(source, new RegExp(document.split('/').at(-1).replaceAll('.', '\\.')))
  }
})

test('module and page guides contain mandatory boundary rules', async () => {
  const moduleGuide = await read('docs/architecture/HOW_TO_ADD_MODULE.md')
  const pageGuide = await read('docs/architecture/HOW_TO_ADD_PAGE.md')
  assert.match(moduleGuide, /~\/modules\/dictionaries/)
  assert.match(moduleGuide, /npm run check/)
  assert.match(pageGuide, /route adapter/i)
  assert.match(pageGuide, /~\/modules\/<name>/)
})

test('architecture guide documents both client and server dependency directions', async () => {
  const source = await read('docs/architecture/ARCHITECTURE.md')
  assert.match(source, /pages \/ layouts \/ middleware/)
  assert.match(source, /server\/api → server\/modules → server\/shared/)
  assert.match(source, /shared\/contracts/)
})


test('document signing guide records public boundaries and backend limitations', async () => {
  const source = await read('docs/architecture/DOCUMENT_SIGNING.md')
  assert.match(source, /DocumentSigningScreen/)
  assert.match(source, /document-registry/)
  assert.match(source, /file-viewer/)
  assert.match(source, /must not be simulated|не должны.*имитироваться/i)
})
