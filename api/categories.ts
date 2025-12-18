import axiosInstance from '@/lib/axios'

export interface Category {
    _id: string
    name: string
}

export interface CategoriesResponse {
    success: boolean
    data: Category[]
    message?: string
}

export const getCategories = async (): Promise<CategoriesResponse> => {
    const response = await axiosInstance.get('/categories')
    return response.data
}

