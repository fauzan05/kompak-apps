import { handle } from 'hono/vercel'
import { app } from '../server/src/app.js'

export const config = {
  runtime: 'nodejs',
}

export default handle(app)
