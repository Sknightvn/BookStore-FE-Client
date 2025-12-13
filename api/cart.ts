import axiosInstance from '@/lib/axios'
import type { CartItem } from '@/contexts/cart-context'

export interface CartRequest {
  userId?: string
  email?: string
  productsCart: CartItem[]
}

export interface CartResponse {
  success: boolean
  data: CartItem[]
}

// POST /api/users/cart - Tạo productsCart cho User
export const createUserCart = async (data: CartRequest): Promise<CartResponse> => {
  const response = await axiosInstance.post('/users/cart', data)
  return response.data
}

// PUT /api/users/cart - Cập nhật productsCart của User
export const updateUserCart = async (data: CartRequest): Promise<CartResponse> => {
  const response = await axiosInstance.put('/users/cart', data)
  return response.data
}

// GET /api/users/cart - Lấy productsCart theo user-id hoặc email
export const getUserCart = async (userId?: string, email?: string): Promise<CartResponse> => {
  const params: { userId?: string; email?: string } = {}
  if (userId) params.userId = userId
  if (email) params.email = email
  
  const response = await axiosInstance.get('/users/cart', { params })
  return response.data
}

