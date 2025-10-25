import { sql } from '@/lib/db'
import * as bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    const result = await sql`
      SELECT id, email, password, role 
      FROM users 
      WHERE email = ${email}
    `
    
    if (result.length === 0) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }
    
    const user = result[0]
  
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (!passwordMatch) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }
  
    return Response.json({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    })
    
  } catch (error) {
    console.error('Error en login:', error)
    return Response.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
