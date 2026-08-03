import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const root = process.cwd()
const sourceExtensions = new Set(['.ts', '.tsx', '.vue', '.js', '.jsx', '.mjs'])
const forbiddenRoots = [
  'app/api',
  'app/components',
  'app/composables',
  'app/stores',
  'app/types',
  'app/utils',
  'shared/types',
]

function walk(directory) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : sourceExtensions.has(extname(entry.name)) ? [path] : []
  })
}

test('legacy application roots are physically removed', () => {
  for (const path of forbiddenRoots) assert.equal(existsSync(join(root, path)), false, `${path} must not exist`)
})

test('source code contains no imports from legacy roots', () => {
  const files = ['app', 'server', 'shared'].flatMap((directory) => walk(join(root, directory)))
  const pattern = /(?:from\s+|import\s*\()['"](?:~\/|@\/)(?:api|components|composables|stores|types|utils)\//
  const offenders = files.filter((file) => pattern.test(readFileSync(file, 'utf8'))).map((file) => relative(root, file))
  assert.deepEqual(offenders, [])
})

test('proven unused production dependencies are removed', () => {
  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  for (const dependency of ['@egjs/vue3-infinitegrid', '@fancyapps/ui', 'jsonwebtoken', 'lucide']) {
    assert.equal(packageJson.dependencies?.[dependency], undefined, `${dependency} must be removed`)
  }
})

test('source tree has no empty directories', () => {
  const roots = ['app', 'server', 'shared']
  const empty = []
  function scan(directory) {
    const entries = readdirSync(directory)
    for (const entry of entries) {
      const path = join(directory, entry)
      if (statSync(path).isDirectory()) scan(path)
    }
    if (directory !== join(root, 'app') && directory !== join(root, 'server') && directory !== join(root, 'shared') && readdirSync(directory).length === 0) empty.push(relative(root, directory))
  }
  for (const directory of roots.map((item) => join(root, item)).filter(existsSync)) scan(directory)
  assert.deepEqual(empty, [])
})
