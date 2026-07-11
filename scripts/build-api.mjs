import * as esbuild from 'esbuild'
import { mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outfile = join(root, 'lib', 'api-app.mjs')

mkdirSync(dirname(outfile), { recursive: true })

await esbuild.build({
  entryPoints: [join(root, 'scripts', 'api-entry.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile,
  packages: 'external',
  logLevel: 'info',
})

console.log(`API bundle → ${outfile}`)
