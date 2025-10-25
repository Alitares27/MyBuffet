'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    loadOrders()
  }, [user, router])

  const loadOrders = () => {
    if (!user) return
    
    fetch('/api/orders', {
      headers: {
        'x-user-id': user.id.toString(),
        'x-role': user.role
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }

  const handleMarkAsDelivered = async (orderId: number) => {
    if (!confirm('¿Marcar esta orden como entregada?')) {
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'entregada' })
      })

      if (response.ok) {
        alert('✅ Orden marcada como entregada')
        loadOrders() 
      } else {
        alert('❌ Error al actualizar la orden')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('¿Cancelar esta orden?')) {
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelada' })
      })

      if (response.ok) {
        alert('✅ Orden cancelada')
        loadOrders()
      } else {
        alert('❌ Error al cancelar la orden')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  if (!user) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus órdenes</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center mt-20">Cargando órdenes...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600 mb-4 text-lg">No tienes órdenes aún</p>
        <button 
          onClick={() => router.push('/products')}
          className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
        >
          Comenzar a comprar
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {user.role === 'admin' ? 'Todas las Órdenes' : 'Mis Órdenes'}
        </h2>
        {user.role === 'admin' && (
          <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            Administrador
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg">Orden #{order.id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {user.role === 'admin' && order.email && (
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    Cliente: {order.email}
                  </p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                order.status === 'entregada' 
                  ? 'bg-green-100 text-green-800' 
                  : order.status === 'pendiente' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {order.status === 'entregada' ? '✓ Entregada' : 
                 order.status === 'pendiente' ? '⏳ Pendiente' : 
                 '✗ Cancelada'}
              </span>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-2xl font-bold text-pink-600">
                Total: ${Number(order.total).toFixed(2)}
              </p>
              
              {order.delivered_at && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Entregada el {new Date(order.delivered_at).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>

            {/* Botones de admin */}
            {user.role === 'admin' && order.status === 'pendiente' && (
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleMarkAsDelivered(order.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition font-medium"
                >
                  ✓ Marcar como entregada
                </button>
                <button 
                  onClick={() => handleCancelOrder(order.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition font-medium"
                >
                  ✗ Cancelar orden
                </button>
              </div>
            )}

            <button 
              onClick={() => router.push(`/orders/${order.id}`)}
              className="mt-3 text-sm text-pink-600 hover:underline"
            >
              Ver detalles de la orden →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
