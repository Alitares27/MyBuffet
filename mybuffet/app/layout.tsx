import './globals.css'
import Navbar from '../components/Navbar'
import { CartProvider } from '@/lib/CartContext'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata = {
  title: 'mapuche',
  description: 'Tienda de postres artesanales'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-pink-50 text-gray-800 font-sans flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 p-6">{children}</main>
            <footer className="text-center text-sm py-3 border-t text-gray-500">
              © {new Date().getFullYear()} Arroyo Seco
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}