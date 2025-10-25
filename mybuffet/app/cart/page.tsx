'use client'
import { useCart } from '@/lib/CartContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'

export default function CartPage() {
  const { user } = useAuth()
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentCode, setPaymentCode] = useState('')
  const [orderId, setOrderId] = useState<number | null>(null)

  if (cart.length === 0 && !showPayment) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600 mb-4 text-lg">Tu carrito está vacío</p>
        <button 
          onClick={() => router.push('/products')}
          className="bg-pink-500 text-white px-6 py-3 rounded"
        >
          Ver productos
        </button>
      </div>
    )
  }

    const handleCheckout = async () => {
    if (!user) {
      alert('Debes iniciar sesión para realizar una compra')
      router.push('/login')
      return
    }
    
    setLoading(true)
    
    try {
      const orderData = {
        user_id: user.id, 
        total: getTotal(),
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setPaymentCode(data.paymentCode)
        setOrderId(data.orderId)
        setShowPayment(true)
        clearCart()
      } else {
        alert('Error al procesar la orden: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // Vista de código de pago
  if (showPayment) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Orden Creada!</h2>
          <p className="text-gray-600">Orden #{orderId}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-2">El Alias de pago es:</p>
          <div className="bg-white border-2 border-pink-500 rounded-lg p-4 mb-2">
            <p className="text-2xl font-mono font-bold text-pink-600">{paymentCode}</p>
          </div>
        </div>

        <div className="text-left bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">Instrucciones de Pago:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Transferencia Bancaria: 0110121430012163919629</li>
            <li>• Efectivo en stand</li>
          </ul>
          <p className="text-xs text-blue-700 mt-3">
            Una vez realizado el pago, por favor acercate a recoger tus productos mostrando el pago realizado.
          </p>
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => router.push('/orders')}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded transition"
          >
            Ver mis órdenes
          </button>
          <button 
            onClick={() => router.push('/products')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded hover:bg-gray-50 transition"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    )
  }

  // Vista del carrito
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Mi Carrito</h1>
        <button 
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="bg-white rounded shadow">
        {cart.map(item => (
          <div key={item.id} className="flex items-center gap-4 border-b p-4">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-pink-600 font-bold">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 text-sm hover:underline mt-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-pink-600">${getTotal().toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded transition disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Finalizar compra'}
          </button>
        </div>
      </div>
    </div>
  )
}
