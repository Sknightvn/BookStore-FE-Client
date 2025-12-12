import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as booksApi from '@/api/books'

// Get all books
export const useBooks = () => {
    return useQuery({
        queryKey: queryKeys.books,
        queryFn: () => booksApi.getBooks(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// Get single book by ID
export const useBook = (id: string) => {
    return useQuery({
        queryKey: queryKeys.book(id),
        queryFn: () => booksApi.getBookById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// Get top products
export const useTopProducts = () => {
    return useQuery({
        queryKey: queryKeys.topProducts,
        queryFn: () => booksApi.getTopProducts(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}
