import { sql } from '@/lib/db'
import * as bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'

// Listar todos los usuarios (solo admin)
export async function GET(req: NextRequest) {
  const role = req.headers.get('x-role')
  if (role !== 'admin') {
    return Response.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  // Simplemente quita el tipo User[] aquí
  const result = await sql`SELECT id, email, role FROM users ORDER BY id`
  return Response.json(result)
}

// Registrar usuario nuevo
export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json()
    
    // Verificar si el usuario ya existe
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return Response.json({ error: 'El email ya está registrado' }, { status: 400 })
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Insertar usuario
    await sql`
      INSERT INTO users (email, password, role) 
      VALUES (${email}, ${hashedPassword}, ${role || 'user'})
    `
    
    return Response.json({ message: 'Usuario creado exitosamente' })
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return Response.json({ error: 'Error al crear usuario' }, { status: 500 })
  }
}
