import { sql } from '@/lib/db'
import * as bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json()
    
    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Actualizar contraseña
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}
      WHERE email = ${email}
    `
    
    return Response.json({ message: 'Contraseña actualizada' })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
