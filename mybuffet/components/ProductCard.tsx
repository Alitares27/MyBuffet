import Link from 'next/link'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded p-4 text-center bg-white shadow-sm relative">
      {/* Badge de disponibilidad */}
      {product.stock === 0 ? (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Agotado
        </span>
      ) : product.stock < 10 ? (
        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          Últimas unidades
        </span>
      ) : null}

      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-40 object-cover rounded" 
      />
      <h2 className="mt-2 font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
      <p className="text-lg font-bold text-pink-500 mt-2">${product.price}</p>
      
      {/* Indicador de stock */}
      <p className={`text-xs mt-1 ${
        product.stock === 0 ? 'text-red-600' :
        product.stock < 10 ? 'text-orange-600' :
        'text-green-600'
      }`}>
        {product.stock === 0 ? 'Sin stock' : `disponibles`}
      </p>

      <Link 
        href={`/products/${product.id}`}
        className={`mt-2 inline-block px-4 py-2 rounded transition ${
          product.stock === 0 
            ? 'bg-gray-400 cursor-not-allowed text-white' 
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { 
          if (product.stock === 0) {
            e.preventDefault()
            alert('Este producto está agotado')
          }
        }}
      >
        {product.stock === 0 ? 'Agotado' : 'Ver detalles'}
      </Link>
    </div>
  )
}
