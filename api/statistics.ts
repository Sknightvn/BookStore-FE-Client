import { axiosInstance } from '@/lib/axios'
import type { BooksResponse } from '@/interface/response/book'

// Get top products (for weekly ranking)
export const getTopProducts = async (): Promise<any> => {
    const response = await axiosInstance.get('/statistics/top')
    return response.data
}
