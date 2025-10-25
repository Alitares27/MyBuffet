import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from './AddToCartButton'
import { sql } from '@/lib/db'
import type { Product } from '@/types'

async function getProduct(id: string): Promise<Product> {
  try {
    
    const result = await sql`SELECT * FROM products WHERE id = ${id}`
    
    if (result.length === 0) {
      notFound()
    }
    
    return result[0] as Product
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      {/* Botón de volver */}
      <Link 
        href="/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a productos
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold">
                  AGOTADO
                </span>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <p className="text-3xl font-bold text-pink-600 mb-4">
              ${product.price}
            </p>

            {/* Indicador de stock */}
            <div className="mb-6">
              <p className={`text-sm font-medium ${
                product.stock === 0 ? 'text-red-600' :
                product.stock < 10 ? 'text-orange-600' :
                'text-green-600'
              }`}>
                {product.stock === 0 ? '❌ Sin stock disponible' :
                 product.stock < 10 ? `⚠️ Solo quedan pocas unidades` :
                 `✅ unidades disponibles`}
              </p>
            </div>

            {/* Botón de agregar al carrito */}
            <AddToCartButton product={product} />
            
            {/* Información adicional */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-2">Información del producto</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Productos frescos y caseros</li>
                <li>• Ingredientes de primera calidad</li>
                <li>• Preparado el mismo día</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
