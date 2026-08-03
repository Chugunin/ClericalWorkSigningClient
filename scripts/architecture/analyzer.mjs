import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.vue', '.js', '.jsx', '.mjs'])
const IMPORT_PATTERNS = [
  /\b(?:import|export)\s+(?:type\s+)?(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
]

function isDirectory(path) {
  try { return statSync(path).isDirectory() } catch { return false }
}

function walk(directory) {
  if (!isDirectory(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [fullPath] : []
  })
}

function normalize(root, path) {
  return relative(root, path).split(sep).join('/')
}

function importsOf(content) {
  const imports = []
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of content.matchAll(pattern)) imports.push(match[1])
  }
  return imports
}

function moduleNameFromPath(path) {
  return path.match(/^app\/modules\/([^/]+)\//)?.[1] ?? null
}

function targetModule(specifier) {
  const match = specifier.match(/^(?:~\/|@\/|#app\/)?modules\/([^/]+)(?:\/(.+))?$/)
  return match ? { name: match[1], internalPath: match[2] ?? null } : null
}

function resolveSourceImport(root, sourcePath, specifier) {
  const aliases = [
    ['~/', 'app/'], ['@/', 'app/'], ['#app/', 'app/'],
    ['~~/', ''], ['@@/', ''], ['#shared/', 'shared/'], ['#server/', 'server/'],
  ]
  let candidate
  for (const [prefix, replacement] of aliases) {
    if (specifier.startsWith(prefix)) {
      candidate = resolve(root, replacement, specifier.slice(prefix.length))
      break
    }
  }
  if (!candidate && specifier.startsWith('.')) candidate = resolve(dirname(sourcePath), specifier)
  if (!candidate) return null

  const variants = [candidate, ...[...SOURCE_EXTENSIONS].map((extension) => `${candidate}${extension}`), ...[...SOURCE_EXTENSIONS].map((extension) => join(candidate, `index${extension}`))]
  return variants.find((path) => existsSync(path)) ?? null
}

function detectModuleCycles(moduleGraph) {
  const cycles = []
  const visiting = new Set()
  const visited = new Set()
  const stack = []

  function visit(node) {
    if (visiting.has(node)) {
      const start = stack.indexOf(node)
      cycles.push([...stack.slice(start), node])
      return
    }
    if (visited.has(node)) return
    visiting.add(node)
    stack.push(node)
    for (const target of moduleGraph.get(node) ?? []) visit(target)
    stack.pop()
    visiting.delete(node)
    visited.add(node)
  }

  for (const node of moduleGraph.keys()) visit(node)
  return cycles
}

function exportedNames(content) {
  const names = []
  for (const match of content.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const item of match[1].split(',')) {
      const normalized = item.trim().replace(/^type\s+/, '')
      const name = normalized.split(/\s+as\s+/).at(-1)?.trim()
      if (name) names.push(name)
    }
  }
  for (const match of content.matchAll(/export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g)) names.push(match[1])
  return names
}

export function analyzeArchitecture(root = process.cwd()) {
  const violations = []
  const files = ['app', 'server', 'shared'].flatMap((directory) => walk(join(root, directory)))
  const moduleRoot = join(root, 'app', 'modules')
  const modules = isDirectory(moduleRoot)
    ? readdirSync(moduleRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
    : []
  const moduleGraph = new Map(modules.map((name) => [name, new Set()]))

  for (const moduleName of modules) {
    if (!existsSync(join(moduleRoot, moduleName, 'index.ts'))) violations.push(`Module '${moduleName}' has no public index.ts`)
  }

  for (const file of files) {
    const path = normalize(root, file)
    const content = readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
    const imports = importsOf(content)
    const owner = moduleNameFromPath(path)

    for (const specifier of imports) {
      const target = targetModule(specifier)
      if ((path.startsWith('app/shared/') || path.startsWith('shared/')) && target) violations.push(`${path}: shared layer imports module '${specifier}'`)
      if (path.startsWith('server/') && target) violations.push(`${path}: server imports client module '${specifier}'`)
      if (owner && target && target.name !== owner) {
        moduleGraph.get(owner)?.add(target.name)
        if (target.internalPath) violations.push(`${path}: module '${owner}' bypasses public API of '${target.name}' via '${specifier}'`)
      }
      if (path.startsWith('app/pages/') && target?.internalPath) violations.push(`${path}: page bypasses module public API via '${specifier}'`)

      if (/^(?:~\/|@\/)(?:api|components|composables|stores|types|utils)\//.test(specifier)) violations.push(`${path}: imports removed compatibility root: '${specifier}'`)

      const resolved = resolveSourceImport(root, file, specifier)
      if (resolved && moduleNameFromPath(normalize(root, resolved)) && owner) {
        const resolvedOwner = moduleNameFromPath(normalize(root, resolved))
        if (resolvedOwner !== owner) moduleGraph.get(owner)?.add(resolvedOwner)
      }
    }

    if (path.startsWith('shared/contracts/') && /from\s+['"](?:vue|nuxt|pinia|@nuxt\/|@vue\/|#app|~\/|@\/)/.test(content)) violations.push(`${path}: shared contract imports framework/UI/application package`)

    if (path.startsWith('app/pages/')) {
      const script = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? ''
      const meaningfulLines = script.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('//'))
      if (meaningfulLines.length > 45) violations.push(`${path}: route adapter is too large (${meaningfulLines.length} script lines)`)
    }
  }

  for (const cycle of detectModuleCycles(moduleGraph)) violations.push(`Module dependency cycle: ${cycle.join(' -> ')}`)

  for (const moduleName of modules) {
    const indexPath = join(moduleRoot, moduleName, 'index.ts')
    if (!existsSync(indexPath)) continue
    const content = readFileSync(indexPath, 'utf8')
    const directNames = exportedNames(content)
    const duplicates = directNames.filter((name, index) => directNames.indexOf(name) !== index)
    for (const name of new Set(duplicates)) violations.push(`app/modules/${moduleName}/index.ts: duplicate public export '${name}'`)
    if (!content.trim()) violations.push(`app/modules/${moduleName}/index.ts: orphan/empty public API`)
  }

  return { files: files.map((file) => normalize(root, file)), modules, violations: [...new Set(violations)].sort() }
}
