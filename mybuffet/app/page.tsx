import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <section className="text-center max-w-4xl mx-auto space-y-8">
        {/* Título principal */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800">
            El Mapuche
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre nuestros postres frescos y caseros, preparados con amor y los mejores ingredientes
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link 
            href="/products" 
            className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-lg transition shadow-md hover:shadow-lg inline-block"
          >
            Ver productos
          </Link>
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-pink-600 font-semibold px-8 py-4 rounded-lg border-2 border-pink-500 transition inline-block"
          >
            Crear cuenta
          </Link>
        </div>

        {/* Características - Centradas */}
        <div className="flex flex-wrap justify-center gap-6 pt-12 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full md:w-80 text-center">
            <div className="text-3xl mb-3">🍰</div>
            <h3 className="font-semibold text-lg mb-2">Postres Artesanales</h3>
            <p className="text-gray-600 text-sm">
              Hechos a mano con ingredientes de primera calidad
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full md:w-80 text-center">
            <div className="text-3xl mb-3">💯</div>
            <h3 className="font-semibold text-lg mb-2">Calidad Garantizada</h3>
            <p className="text-gray-600 text-sm">
              Satisfacción del cliente en cada bocado
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
