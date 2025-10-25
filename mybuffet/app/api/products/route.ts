import { sql } from '@/lib/db'
import type { NextRequest } from 'next/server'

// GET: Listar productos
export async function GET() {
  const result = await sql`SELECT * FROM products ORDER BY id`
  return Response.json(result)
}

// POST: Crear producto
export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    name: string
    description: string
    price: number
    image: string
  }
  
  await sql`
    INSERT INTO products (name, description, price, image)
    VALUES (${body.name}, ${body.description}, ${body.price}, ${body.image})
  `
  
  return Response.json({ message: 'Producto creado exitosamente' })
}
