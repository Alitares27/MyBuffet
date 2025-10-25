import Link from 'next/link'

export default function ProductCard({ product }) {
  return (
    <div className="border rounded p-4 text-center bg-white shadow-sm">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
      <h3 className="font-medium mt-2">{product.name}</h3>
      <p className="text-pink-600 font-semibold">${product.price}</p>
      <Link href={'/products/'+product.id} className="block mt-3 text-pink-500 underline">Ver</Link>
    </div>
  )
}
