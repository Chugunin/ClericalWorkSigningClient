import { analyzeArchitecture } from './architecture/analyzer.mjs'

const result = analyzeArchitecture(process.cwd())
if (result.violations.length) {
  console.error(`Architecture check failed with ${result.violations.length} violation(s):`)
  for (const violation of result.violations) console.error(`- ${violation}`)
  process.exit(1)
}
console.log(`[architecture] OK: scanned ${result.files.length} source files and ${result.modules.length} module(s)`)
