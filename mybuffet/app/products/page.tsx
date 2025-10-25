'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center mt-20">Cargando productos...</div>
  }

  if (products.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600 mb-4">No hay productos disponibles</p>
        <Link href="/admin/products" className="text-pink-500 underline">
          Crear el primer producto
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {products.map((p: any) => (
        <div key={p.id} className="border rounded p-4 bg-white shadow-sm hover:shadow-md transition">
          <img 
            src={p.image} 
            alt={p.name} 
            className="w-full h-40 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'
            }}
          />
          <h3 className="font-semibold mt-3">{p.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{p.description}</p>
          <p className="text-pink-600 font-bold mt-2">${p.price}</p>
          <Link 
            href={`/products/${p.id}`} 
            className="block mt-3 text-center bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
          >
            Ver detalles
          </Link>
        </div>
      ))}
    </div>
  )
}
