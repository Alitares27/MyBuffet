import Link from 'next/link'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded p-4 text-center bg-white shadow-sm">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-40 object-cover rounded" 
      />
      <h2 className="mt-2 font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
      <p className="text-lg font-bold text-pink-500 mt-2">${product.price}</p>
      <Link 
        href={`/products/${product.id}`}
        className="mt-2 inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
      >
        Ver detalles
      </Link>
    </div>
  )
}
