'use client'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center mt-20">Cargando productos...</div>
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-6">Nuestros Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
