'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductCard from './ProductCard'
import ProductCardSkeleton from './productcard-skeleton'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from '@/hooks/use-toast'

interface Product {
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

interface ApiResponse {
    items: Product[]
    total: number
    pages: number
    current_page: number
}

const API_BASE_URL = 'http://localhost:5000/api'

export default function ProductGrid() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', currentPage.toString())
                params.set('per_page', itemsPerPage.toString())

                const categoryParams = searchParams.getAll('category')
                if (categoryParams.length) {
                    categoryParams.forEach(cat => params.append('category', cat))
                }

                const searchTerm = searchParams.get('search')
                if (searchTerm) {
                    params.set('search', searchTerm)
                }

                const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`)
                if (!response.ok) throw new Error('Failed to fetch products')
                const data: ApiResponse = await response.json()
                setProducts(data.items)
                setTotalPages(data.pages)
                setCurrentPage(data.current_page)
            } catch (error) {
                console.error('Error:', error)
                toast({
                    title: "Error",
                    description: "Failed to fetch products",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [searchParams, currentPage, itemsPerPage])

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', value)
        params.set('page', '1')
        router.push(`/?${params.toString()}`)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`/?${params.toString()}`)
        setCurrentPage(page)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Products</h2>
                <Select onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('per_page', value)
                        params.set('page', '1')
                        router.push(`/?${params.toString()}`)
                        setCurrentPage(1)
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="20">20 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                    : products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
            </div>
            {!loading && totalPages > 0 && (
                <div className="mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(Math.max(1, currentPage - 1))
                                    }}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(i + 1)
                                        }}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(Math.min(totalPages, currentPage + 1))
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}

