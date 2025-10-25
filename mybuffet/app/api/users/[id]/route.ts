import { sql } from '@/lib/db'
import type { NextRequest } from 'next/server'
import * as bcrypt from 'bcryptjs'


type Params = { id: string }

export async function GET(_req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params
  const result = await sql`SELECT id, email, role FROM users ORDER BY id`
  if (result.length === 0) return Response.json({ error: 'No encontrado' }, { status: 404 })
  return Response.json(result[0])
}

export async function PUT(req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params
  const body = (await req.json()) as { password?: string; role?: 'user'|'admin' }
  if (body.password) {
    const hashed = await bcrypt.hash(body.password, 10)
    await sql`UPDATE users SET password = ${hashed} WHERE id = ${id}`
  }
  if (body.role) {
    await sql`UPDATE users SET role = ${body.role} WHERE id = ${id}`
  }
  return Response.json({ message: 'Usuario actualizado' })
}

export async function DELETE(_req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params
  await sql`DELETE FROM users WHERE id = ${id}`
  return Response.json({ message: 'Usuario eliminado' })
}
