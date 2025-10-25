import { sql } from '@/lib/db'
import type { NextRequest } from 'next/server'

type Params = { id: string }

export async function PUT(req: NextRequest, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params
    const { status } = await req.json()
    
    if (status === 'entregada') {
      await sql`
        UPDATE orders 
        SET status = ${status}, 
            delivered_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `
    } else {
      await sql`
        UPDATE orders 
        SET status = ${status}
        WHERE id = ${id}
      `
    }
    
    return Response.json({ message: 'Orden actualizada exitosamente' })
  } catch (error) {
    console.error('Error al actualizar orden:', error)
    return Response.json({ error: 'Error al actualizar orden' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params
    
    const orderResult = await sql`
      SELECT o.*, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${id}
    `
    
    if (orderResult.length === 0) {
      return Response.json({ error: 'Orden no encontrada' }, { status: 404 })
    }
    
    const items = await sql`
      SELECT oi.*, p.name as product_name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${id}
    `
    
    return Response.json({
      ...orderResult[0],
      items
    })
  } catch (error) {
    console.error('Error al obtener orden:', error)
    return Response.json({ error: 'Error al obtener orden' }, { status: 500 })
  }
}
