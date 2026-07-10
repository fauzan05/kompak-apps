import postgres from 'postgres'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '../.env') })
config()

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL tidak ditemukan')

export const sql = postgres(url, { max: 10 })

export const DEMO_PRODUCER_ID = process.env.VITE_DEMO_PRODUCER_ID || 'ENT-DEMO-PRODUCER-001'
export const DEMO_COOP_ID = process.env.VITE_DEMO_COOP_ID || 'KOP-02AFA0134DB2'
