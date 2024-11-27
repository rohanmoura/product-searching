import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: number
    name: string
    description: string
    price: number
    category: string
    image_url: string
    rating: number
    stock: number
    brand: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48">
            <Image
              src={product.image_url || '/placeholder.jpg'} // Add fallback image
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.round(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">
                ({product.rating.toFixed(1)})
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-gray-600">
            {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
          </p>
        </CardFooter>
      </Card>
    )
  }

