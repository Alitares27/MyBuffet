import { sql } from '@/lib/db'
import type { NextRequest } from 'next/server'

export async function GET() {
  const result = await sql`SELECT * FROM products ORDER BY id DESC`
  return Response.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, stock, image } = await req.json()
    
    await sql`
      INSERT INTO products (name, description, price, stock, image)
      VALUES (${name}, ${description}, ${price}, ${stock || 0}, ${image})
    `
    
    return Response.json({ message: 'Producto creado exitosamente' })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return Response.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
