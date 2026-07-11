import postgres from 'postgres'
import { config } from 'dotenv'
import { join } from 'path'
import { projectRoot } from './paths.js'

if (!process.env.VERCEL) {
  config({ path: join(projectRoot, '.env') })
}

type Sql = ReturnType<typeof postgres>

let client: Sql | null = null

function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function isValidPgUrl(url: string): boolean {
  try {
    new URL(url.replace(/^postgresql:\/\//, 'http://'))
    return true
  } catch {
    return false
  }
}

function buildUrlFromParts(): string | undefined {
  const host = cleanEnv(process.env.POSTGRES_HOST)
  const user = cleanEnv(process.env.POSTGRES_USER)
  const password = cleanEnv(process.env.POSTGRES_PASSWORD)
  const database = cleanEnv(process.env.POSTGRES_DATABASE) || 'postgres'
  const port = cleanEnv(process.env.POSTGRES_PORT) || '6543'

  if (!host || !user || !password) return undefined

  const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
  return `postgresql://${auth}@${host}:${port}/${database}`
}

function getDatabaseUrl(): string | undefined {
  const candidates = [
    cleanEnv(process.env.POSTGRES_URL),
    cleanEnv(process.env.POSTGRES_URL_NON_POOLING),
    cleanEnv(process.env.DATABASE_URL),
    buildUrlFromParts(),
  ].filter((value): value is string => Boolean(value))

  for (const url of candidates) {
    if (isValidPgUrl(url)) return url
  }

  return buildUrlFromParts()
}

function getClient(): Sql {
  if (client) return client

  const url = getDatabaseUrl()
  if (!url) {
    throw new Error(
      'DATABASE_URL tidak ditemukan — set di Vercel (atau salin POSTGRES_URL dari integrasi Supabase)',
    )
  }

  const isServerless = Boolean(process.env.VERCEL)
  const isSupabase = url.includes('supabase.com')

  client = postgres(url, {
    max: isServerless ? 1 : 10,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
    ssl: isSupabase ? { rejectUnauthorized: false } : false,
  })

  return client
}

const SKIP_PROXY_PROPS = new Set<PropertyKey>(['then', 'catch', 'finally', Symbol.toStringTag, Symbol.iterator])

export const sql = new Proxy(((...args: Parameters<Sql>) => getClient()(...args)) as Sql, {
  get(_target, prop) {
    if (SKIP_PROXY_PROPS.has(prop)) return undefined
    const value = (getClient() as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(getClient()) : value
  },
})

export const DEMO_PRODUCER_ID = process.env.VITE_DEMO_PRODUCER_ID || 'ENT-DEMO-PRODUCER-001'
export const DEMO_COOP_ID = process.env.VITE_DEMO_COOP_ID || 'KOP-02AFA0134DB2'
export const DEMO_OFFTAKER_ID = process.env.VITE_DEMO_OFFTAKER_ID || 'OFT-DEMO-001'
