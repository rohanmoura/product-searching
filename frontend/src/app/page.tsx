import Header from '@/components/Header'
import ProductGrid from '@/components/product-grid'
import Sidebar from '@/components/sidebar'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar />
          <main className="flex-1">
            <ProductGrid />
          </main>
        </div>
      </div>
    </div>
  )
}

