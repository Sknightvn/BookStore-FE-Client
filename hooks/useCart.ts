import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as cartApi from '@/api/cart'
import type { CartRequest } from '@/api/cart'

// GET /api/users/cart - Lấy productsCart theo user-id hoặc email
export const useUserCart = (userId?: string, email?: string) => {
  return useQuery({
    queryKey: queryKeys.userCart(userId || email || ''),
    queryFn: () => cartApi.getUserCart(userId, email),
    enabled: !!(userId || email),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// POST /api/users/cart - Tạo productsCart cho User
export const useCreateUserCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CartRequest) => cartApi.createUserCart(data),
    onSuccess: (response, variables) => {
      // Invalidate và refetch cart data
      const key = variables.userId || variables.email || ''
      queryClient.invalidateQueries({ queryKey: queryKeys.userCart(key) })
    },
  })
}

// PUT /api/users/cart - Cập nhật productsCart của User
export const useUpdateUserCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CartRequest) => cartApi.updateUserCart(data),
    onSuccess: (response, variables) => {
      // Invalidate và refetch cart data
      const key = variables.userId || variables.email || ''
      queryClient.invalidateQueries({ queryKey: queryKeys.userCart(key) })
      // Update cache với data mới
      queryClient.setQueryData(queryKeys.userCart(key), response)
    },
  })
}

