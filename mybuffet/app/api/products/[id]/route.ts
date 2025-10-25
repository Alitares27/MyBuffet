import { sql } from '@/lib/db'
import type { NextRequest } from 'next/server'

type Params = { id: string }

export async function GET(_req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params
  
  const result = await sql`SELECT * FROM products WHERE id = ${id}`
  
  if (result.length === 0) {
    return Response.json({ error: 'Producto no encontrado' }, { status: 404 })
  }
  
  return Response.json(result[0])
}

export async function PUT(req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params
  const body = (await req.json()) as { 
    name?: string
    description?: string
    price?: number
    image?: string 
  }
  
  await sql`
    UPDATE products 
    SET name = COALESCE(${body.name}, name),
        description = COALESCE(${body.description}, description),
        price = COALESCE(${body.price}, price),
        image = COALESCE(${body.image}, image)
    WHERE id = ${id}
  `
  
  return Response.json({ message: 'Producto actualizado' })
}

export async function DELETE(_req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params
  await sql`DELETE FROM products WHERE id = ${id}`
  return Response.json({ message: 'Producto eliminado' })
}
