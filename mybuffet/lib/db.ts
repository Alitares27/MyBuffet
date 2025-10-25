import { neon } from '@neondatabase/serverless'

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`
export const sql = neon(connectionString)
