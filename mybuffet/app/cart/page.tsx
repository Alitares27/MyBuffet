'use client'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentCode, setPaymentCode] = useState('')
  const [orderId, setOrderId] = useState<number | null>(null)

  const handleCheckout = async () => {
    if (!user) {
      alert('❌ Debes iniciar sesión para finalizar la compra')
      router.push('/login')
      return
    }

    if (cart.length === 0) {
      alert('❌ El carrito está vacío')
      return
    }

    setLoading(true)

    try {
      for (const item of cart) {
        const res = await fetch(`/api/products/${item.id}`)
        const product = await res.json()
        
        if (product.stock < item.quantity) {
          alert(
            `❌ Stock insuficiente para ${item.name}\n\n` +
            `Disponible: ${product.stock} unidades\n` +
            `En tu carrito: ${item.quantity} unidades\n\n` +
            `Por favor, ajusta la cantidad.`
          )
          setLoading(false)
          return
        }
      }

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
        alert(`❌ ${data.error || 'Error al procesar la orden'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  if (showPayment) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-lg text-center">
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
          <p className="text-sm text-gray-600 mb-2">Tu código de pago es:</p>
          <div className="bg-white border-2 border-pink-500 rounded-lg p-4 mb-2">
            <p className="text-2xl font-mono font-bold text-pink-600">{paymentCode}</p>
          </div>
          <p className="text-xs text-gray-500">
            Usa este código para realizar el pago
          </p>
        </div>

        <div className="text-left bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">💳 Métodos de Pago:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Transferencia Bancaria</li>
            <li>• Billetera Electronica</li>
            <li>• Efectivo en Stand</li>
          </ul>
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => router.push('/orders')}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg transition font-semibold"
          >
            Ver mis órdenes
          </button>
          <button 
            onClick={() => router.push('/products')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <div className="mb-6">
          <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4 text-lg">Tu carrito está vacío</p>
        <button 
          onClick={() => router.push('/products')}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition"
        >
          Ver productos
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Mi Carrito</h1>
        <button 
          onClick={() => {
            if (confirm('¿Vaciar el carrito?')) {
              clearCart()
            }
          }}
          className="text-red-600 hover:text-red-800 text-sm hover:underline"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {/* Items del carrito */}
        {cart.map(item => (
          <div key={item.id} className="flex items-center gap-4 border-b p-4 hover:bg-gray-50 transition">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded"
            />
            
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-pink-600 font-bold">${item.price}</p>
            </div>
            
            {/* Controles de cantidad */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            
            {/* Subtotal y eliminar */}
            <div className="text-right">
              <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              <button 
                onClick={() => {
                  if (confirm(`¿Eliminar ${item.name} del carrito?`)) {
                    removeFromCart(item.id)
                  }
                }}
                className="text-red-600 text-sm hover:underline mt-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {/* Total y botón de checkout */}
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Total ({cart.reduce((sum, item) => sum + item.quantity, 0)} productos)</p>
              <span className="text-2xl font-bold text-pink-600">${getTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={loading || !user}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Procesando...' : 
             !user ? 'Inicia sesión para comprar' : 
             'Finalizar compra'}
          </button>

          {!user && (
            <p className="text-center text-sm text-gray-600 mt-3">
              <button 
                onClick={() => router.push('/login')}
                className="text-pink-600 hover:underline font-medium"
              >
                Inicia sesión
              </button>
              {' o '}
              <button 
                onClick={() => router.push('/register')}
                className="text-pink-600 hover:underline font-medium"
              >
                regístrate
              </button>
              {' '}para continuar
            </p>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Información importante:</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Se verificará el stock antes de procesar tu orden</li>
          <li>• Recibirás un código de pago único</li>
          <li>• Los productos se reservarán al confirmar la orden</li>
        </ul>
      </div>
    </div>
  )
}
