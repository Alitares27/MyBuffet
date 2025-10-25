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
  try {
    const { id } = await context.params
    const body = await req.json()
    
    if (body.price !== undefined && body.stock === undefined) {
      await sql`
        UPDATE products 
        SET price = ${body.price}
        WHERE id = ${id}
      `
      return Response.json({ message: 'Precio actualizado exitosamente' })
    }
    
    if (body.stock !== undefined && body.price === undefined) {
      await sql`
        UPDATE products 
        SET stock = ${body.stock}
        WHERE id = ${id}
      `
      return Response.json({ message: 'Inventario actualizado exitosamente' })
    }
    
    await sql`
      UPDATE products 
      SET name = ${body.name}, 
          description = ${body.description}, 
          price = ${body.price}, 
          stock = ${body.stock},
          image = ${body.image}
      WHERE id = ${id}
    `
    
    return Response.json({ message: 'Producto actualizado exitosamente' })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return Response.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params
    await sql`DELETE FROM products WHERE id = ${id}`
    return Response.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return Response.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
