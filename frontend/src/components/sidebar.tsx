'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

const API_BASE_URL = 'http://localhost:5000/api'

export default function Sidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [rating, setRating] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/categories`)
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category)
    setSelectedCategories(newCategories)
    
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    newCategories.forEach(cat => params.append('category', cat))
    router.push(`/?${params.toString()}`)
  }

  return (
    <aside className="w-full md:w-64 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[90px]" />
          </div>
        ) : (
          categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
              />
              <Label htmlFor={category}>{category}</Label>
            </div>
          ))
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value)
            const params = new URLSearchParams(searchParams.toString())
            params.set('minPrice', value[0].toString())
            params.set('maxPrice', value[1].toString())
            router.push(`/?${params.toString()}`)
          }}
        />
        <div className="flex justify-between mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Minimum Rating</h3>
        <Slider
          min={0}
          max={5}
          step={1}
          value={[rating]}
          onValueChange={(value) => {
            setRating(value[0])
            const params = new URLSearchParams(searchParams.toString())
            params.set('rating', value[0].toString())
            router.push(`/?${params.toString()}`)
          }}
        />
        <div className="mt-2">{rating} stars and up</div>
      </div>
    </aside>
  )
}

