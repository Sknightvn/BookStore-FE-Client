import axiosInstance from '@/lib/axios'
import type { BooksResponse, BookResponse, TopProductsResponse } from '@/interface/response/book'

// Get all books
export const getBooks = async (): Promise<BooksResponse> => {
    const response = await axiosInstance.get('/books')
    return response.data
}

// Get single book by ID
export const getBookById = async (id: string): Promise<BookResponse> => {
    const response = await axiosInstance.get(`/books/${id}`)
    return response.data
}

// Get top/trending products
export const getTopProducts = async (): Promise<TopProductsResponse> => {
    const response = await axiosInstance.get('/books/top')
    return response.data
}
