import { sql } from '@/lib/db'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  const role = req.headers.get('x-role')

  console.log('GET /api/orders - userId:', userId, 'role:', role)

  if (!userId) {
    return Response.json({ error: 'Usuario no autenticado' }, { status: 401 })
  }

  let result
  if (role === 'admin') {
    result = await sql`
      SELECT o.*, u.email
      FROM orders o 
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `
  } else {
    result = await sql`
      SELECT id, user_id, total, status, delivered_at, created_at
      FROM orders
      WHERE user_id = ${Number(userId)}
      ORDER BY created_at DESC
    `
  }

  console.log('Órdenes encontradas:', result.length)

  return Response.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    console.log('Creando orden:', body)

    for (const item of body.items) {
      const productResult = await sql`
        SELECT id, name, stock 
        FROM products 
        WHERE id = ${item.product_id}
      `
      
      if (productResult.length === 0) {
        return Response.json(
          { error: `Producto ${item.product_id} no encontrado` }, 
          { status: 400 }
        )
      }
      
      const product = productResult[0]
      
      if (product.stock < item.quantity) {
        return Response.json(
          { 
            error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, solicitado: ${item.quantity}` 
          }, 
          { status: 400 }
        )
      }
    }
    
    const orderResult = await sql`
      INSERT INTO orders (user_id, total, status)
      VALUES (${body.user_id}, ${body.total}, 'pendiente')
      RETURNING id
    `
    
    const orderId = orderResult[0].id
    
    for (const item of body.items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
      `
      
      await sql`
        UPDATE products 
        SET stock = stock - ${item.quantity}
        WHERE id = ${item.product_id}
      `
    }
    
    const paymentCode = `nacion.sud`
    
    return Response.json({ 
      success: true,
      orderId,
      paymentCode,
      message: 'Orden creada exitosamente. Stock actualizado.'
    })
    
  } catch (error) {
    console.error('Error al crear orden:', error)
    return Response.json({ error: 'Error al procesar la orden' }, { status: 500 })
  }
}
