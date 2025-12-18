import axiosInstance from '@/lib/axios'
import type { BooksResponse, BookResponse, TopProductsResponse } from '@/interface/response/book'

// Get all books
export const getBooks = async (page?: number, limit?: number): Promise<BooksResponse> => {
    const params = new URLSearchParams()
    if (page !== undefined) {
        params.append('page', page.toString())
    }
    if (limit !== undefined) {
        params.append('limit', limit.toString())
    }
    const queryString = params.toString()
    const url = queryString ? `/books?${queryString}` : '/books'
    const response = await axiosInstance.get(url)
    return response.data
}

// Get single book by ID
export const getBookById = async (id: string): Promise<BookResponse> => {
    const response = await axiosInstance.get(`/books/${id}`)
    return response.data
}

// Get top/trending products
export const getTopProducts = async (): Promise<TopProductsResponse> => {
    const response = await axiosInstance.get('/statistics/top')
    return response.data
}
