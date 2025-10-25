'use client'
import { useCart } from '@/lib/CartContext'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    if (product.stock === 0) {
      alert('❌ Este producto está agotado')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    
    alert('✅ Producto agregado al carrito')
    router.push('/cart')
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      className={`w-full py-3 rounded-lg font-semibold transition ${
        product.stock === 0
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-pink-500 hover:bg-pink-600 text-white'
      }`}
    >
      {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
    </button>
  )
}
