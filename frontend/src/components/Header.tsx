'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from 'next/navigation'
import { ThemeSwitcher } from './theme-switcher'
import { useDebounce } from '@/hooks/use-debounce'

export default function Header() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const debouncedSearch = useDebounce(searchTerm, 500)

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (debouncedSearch) {
            params.set('search', debouncedSearch)
        } else {
            params.delete('search')
        }
        router.push(`/?${params.toString()}`)
    }, [debouncedSearch])

    return (
        <header className="bg-background border-b">
            <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ThemeSwitcher />
            </div>
        </header>
    )
}

