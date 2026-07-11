import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const srcDir = dirname(fileURLToPath(import.meta.url))

/** Folder `server/` — stabil meski proses dijalankan dari root repo */
export const serverRoot = join(srcDir, '..')

/** Root monorepo (parent dari server/) */
export const projectRoot = join(serverRoot, '..')

export const uploadsDir = join(serverRoot, 'uploads')
