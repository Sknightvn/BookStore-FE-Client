import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as booksApi from '@/api/books'
import type { AddReviewRequest } from '@/interface/request/book'

// Get all books
export const useBooks = (page?: number, limit?: number) => {
    return useQuery({
        queryKey: queryKeys.booksPaginated(page, limit),
        queryFn: () => booksApi.getBooks(page, limit),
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

// Add review to a book
export const useAddReview = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: AddReviewRequest) => booksApi.addBookReview(data),
        onSuccess: (_, variables) => {
            // Invalidate and refetch the book data to get updated reviews
            queryClient.invalidateQueries({ queryKey: queryKeys.book(variables.bookId) })
            queryClient.refetchQueries({ queryKey: queryKeys.book(variables.bookId) })
        },
    })
}
