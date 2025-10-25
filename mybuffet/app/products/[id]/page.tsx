'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!params?.id) {
      setError('ID de producto no válido')
      setLoading(false)
      return
    }
    
    fetch(`/api/products/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Producto no encontrado')
        return res.json()
      })
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [params?.id])

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
    
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return <div className="text-center mt-20">Cargando producto...</div>
  }

  if (error || !product) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-600 mb-4">{error || 'Producto no encontrado'}</p>
        <button 
          onClick={() => router.push('/products')}
          className="bg-pink-500 text-white px-6 py-2 rounded"
        >
          Volver a productos
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-60 object-cover rounded"
      />
      <h1 className="text-2xl font-semibold mt-4">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="font-bold text-pink-600 text-2xl mt-4">${product.price}</p>
      
      <button 
        onClick={handleAddToCart}
        className={`mt-4 w-full px-6 py-3 rounded transition ${
          added 
            ? 'bg-green-500 text-white' 
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
      </button>
      
      <button 
        onClick={() => router.push('/products')}
        className="mt-2 w-full border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50 transition"
      >
        Volver a productos
      </button>
    </div>
  )
}
