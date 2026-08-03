import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const tools = [
  {
    name: 'nuxt',
    packagePath: 'nuxt/package.json',
  },
  {
    name: 'typescript',
    packagePath: 'typescript/package.json',
  },
  {
    name: 'eslint',
    packagePath: 'eslint/package.json',
  },
  {
    name: 'vitest',
    packagePath: 'vitest/package.json',
  },
]

let hasMissingTools = false

for (const tool of tools) {
  try {
    require.resolve(tool.packagePath)
    console.log(`[toolchain] OK: ${tool.name}`)
  }
  catch (error) {
    hasMissingTools = true
    console.error(`[toolchain] MISSING: ${tool.name}`)

    if (process.env.DEBUG_TOOLCHAIN === '1') {
      console.error(error)
    }
  }
}

if (hasMissingTools) {
  process.exitCode = 1
}