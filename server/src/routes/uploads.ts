import { Hono } from 'hono'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { uploadsDir } from '../paths.js'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export const uploadsRoute = new Hono()

uploadsRoute.post('/', async (c) => {
  const body = await c.req.parseBody()
  const file = body.file

  if (!file || typeof file === 'string') {
    return c.json({ error: 'File foto wajib diunggah' }, 400)
  }

  if (!ALLOWED.has(file.type)) {
    return c.json({ error: 'Format harus JPEG, PNG, atau WebP' }, 400)
  }

  if (file.size > MAX_BYTES) {
    return c.json({ error: 'Ukuran file maksimal 5 MB' }, 400)
  }

  await mkdir(uploadsDir, { recursive: true })

  const ext = EXT[file.type] || 'jpg'
  const filename = `${randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(join(uploadsDir, filename), buffer)

  return c.json({ url: `/uploads/${filename}` }, 201)
})
