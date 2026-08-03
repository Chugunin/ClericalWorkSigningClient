import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const root = path.resolve(import.meta.dirname, '../..')

async function source(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8')
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(absolute))
    else if (/\.(?:ts|vue)$/.test(entry.name)) files.push(absolute)
  }
  return files
}

test('exports only the supported dictionaries public API', async () => {
  const publicApi = await source('app/modules/dictionaries/index.ts')
  assert.match(publicApi, /useDictionariesStore/)
  assert.doesNotMatch(publicApi, /DictionariesApi|createDictionariesCache|DictionariesResponse/)
})

test('all external consumers use the module public API', async () => {
  const files = await walk(path.join(root, 'app'))
  for (const file of files) {
    if (file.includes(`${path.sep}modules${path.sep}dictionaries${path.sep}`)) continue
    const content = await readFile(file, 'utf8')
    assert.doesNotMatch(content, /~\/modules\/dictionaries\//, file)
    assert.doesNotMatch(content, /~\/(?:stores\/dictionaries|api\/dictionaries)/, file)
  }
})

test('dictionaries module does not depend on other business modules', async () => {
  const files = await walk(path.join(root, 'app/modules/dictionaries'))
  for (const file of files) {
    const content = await readFile(file, 'utf8')
    assert.doesNotMatch(content, /~\/modules\/(?:auth|documents|file-viewer|document-)/, file)
  }
})
