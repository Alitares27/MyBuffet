import { sql } from '@/lib/db'
import type { NextRequest } from 'next/server'

// Obtener todas las órdenes (admin) o solo las del usuario actual
export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  const role = req.headers.get('x-role')

  console.log('GET /api/orders - userId:', userId, 'role:', role) // Debug

  if (!userId) {
    return Response.json({ error: 'Usuario no autenticado' }, { status: 401 })
  }

  let result
  if (role === 'admin') {
    // Admins ven todas las órdenes con email del usuario
    result = await sql`
      SELECT o.*, u.email
      FROM orders o 
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `
  } else {
    // Usuarios normales solo ven sus propias órdenes
    result = await sql`
      SELECT id, user_id, total, status, delivered_at, created_at
      FROM orders
      WHERE user_id = ${Number(userId)}
      ORDER BY created_at DESC
    `
  }

  console.log('Órdenes encontradas:', result.length) // Debug

  return Response.json(result)
}

// Crear nueva orden
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    console.log('Creando orden:', body) // Debug
    
    // Insertar la orden
    const orderResult = await sql`
      INSERT INTO orders (user_id, total, status)
      VALUES (${body.user_id}, ${body.total}, 'pendiente')
      RETURNING id
    `
    
    const orderId = orderResult[0].id
    
    // Insertar los items de la orden
    for (const item of body.items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
      `
    }
    
    // Generar código de pago simple
    const paymentCode = `nacion.sud`
    
    return Response.json({ 
      success: true,
      orderId,
      paymentCode,
      message: 'Orden creada exitosamente'
    })
    
  } catch (error) {
    console.error('Error al crear orden:', error)
    return Response.json({ error: 'Error al procesar la orden' }, { status: 500 })
  }
}
