import postgres from 'postgres'
import { config } from 'dotenv'
import { join } from 'path'
import { projectRoot } from './paths.js'

config({ path: join(projectRoot, '.env') })

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL tidak ditemukan — pastikan .env ada di root proyek')

export const sql = postgres(url, { max: 10 })

export const DEMO_PRODUCER_ID = process.env.VITE_DEMO_PRODUCER_ID || 'ENT-DEMO-PRODUCER-001'
export const DEMO_COOP_ID = process.env.VITE_DEMO_COOP_ID || 'KOP-02AFA0134DB2'
export const DEMO_OFFTAKER_ID = process.env.VITE_DEMO_OFFTAKER_ID || 'OFT-DEMO-001'
