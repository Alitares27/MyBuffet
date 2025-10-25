'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'


export default function Navbar() {
  const path = usePathname()
  const router = useRouter()
  const { getItemCount } = useCart()
  const { user, logout } = useAuth()
  const itemCount = getItemCount()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
      <Link href="/" className="font-bold text-pink-600 text-lg">
        El Mapuche
      </Link>
      
      <div className="space-x-4 flex items-center">
        <Link 
          href="/products" 
          className={path==='/products'?'text-pink-600 underline':'text-gray-700'}
        >
          Productos
        </Link>
        
        <Link 
          href="/cart" 
          className={`${path==='/cart'?'text-pink-600 underline':'text-gray-700'} relative`}
        >
          Carrito
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
        
        {user && (
          <Link 
            href="/orders" 
            className={path==='/orders'?'text-pink-600 underline':'text-gray-700'}
          >
            Órdenes
          </Link>
        )}
        
        {user?.role === 'admin' && (
          <Link 
            href="/admin/products" 
            className={path==='/admin/products'?'text-pink-600 underline':'text-gray-700'}
          >
            Admin
          </Link>
        )}
        
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <button 
              onClick={handleLogout} 
              className="text-sm text-red-600 hover:underline"
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              href="/login" 
              className="text-sm text-gray-700 hover:text-pink-600"
            >
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
