'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !params?.id) return
    
    fetch(`/api/orders/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [params?.id, user])

  if (loading) {
    return <div className="text-center mt-20">Cargando detalles...</div>
  }

  if (!order) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-600 mb-4">Orden no encontrada</p>
        <button onClick={() => router.push('/orders')} className="text-pink-600 underline">
          Volver a órdenes
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <button 
        onClick={() => router.push('/orders')}
        className="text-pink-600 hover:underline mb-6 flex items-center gap-2"
      >
        ← Volver a órdenes
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Orden #{order.id}</h1>
            <p className="text-gray-600">Cliente: {order.email}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleString('es-AR')}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            order.status === 'entregada' 
              ? 'bg-green-100 text-green-800' 
              : order.status === 'pendiente' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {order.status}
          </span>
        </div>

        <div className="border-t pt-4">
          <h2 className="font-semibold mb-4">Productos</h2>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                <img 
                  src={item.image} 
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.quantity} x ${item.price}
                  </p>
                </div>
                <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-pink-600">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
