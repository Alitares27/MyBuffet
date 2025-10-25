import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
      <p className="text-gray-600 mb-6">El producto que buscas no existe</p>
      <Link 
        href="/products"
        className="bg-pink-500 text-white px-6 py-3 rounded inline-block"
      >
        Ver todos los productos
      </Link>
    </div>
  )
}
