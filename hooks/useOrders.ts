import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as ordersApi from '@/api/orders'
import type { CreateOrderRequest, CancelOrderRequest } from '@/interface/request/order'

// Get user orders
export const useUserOrders = (userId: string) => {
    return useQuery({
        queryKey: queryKeys.userOrders(userId),
        queryFn: () => ordersApi.getUserOrders(userId),
        enabled: !!userId,
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: 4 * 1000, // Auto-refetch every 4 seconds
    })
}

// Get order by code
export const useOrderByCode = (code: string): UseQueryResult<Awaited<ReturnType<typeof ordersApi.getOrderByCode>>, Error> => {
    return useQuery({
        queryKey: queryKeys.orderByCode(code),
        queryFn: () => ordersApi.getOrderByCode(code),
        enabled: !!code,
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 4 * 1000, // Auto-refetch every 4 seconds
    })
}

// Create order (COD)
export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateOrderRequest) => ordersApi.createOrder(data),
        onSuccess: (_, variables) => {
            // Invalidate user orders
            queryClient.invalidateQueries({ queryKey: queryKeys.userOrders(variables.user) })
            // Invalidate all orders (for admin)
            queryClient.invalidateQueries({ queryKey: queryKeys.orders })
            queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders })
        },
    })
}

// Create VNPay order
export const useCreateVNPayOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateOrderRequest) => ordersApi.createVNPayOrder(data),
        onSuccess: (_, variables) => {
            // Invalidate user orders
            queryClient.invalidateQueries({ queryKey: queryKeys.userOrders(variables.user) })
            // Invalidate all orders (for admin)
            queryClient.invalidateQueries({ queryKey: queryKeys.orders })
            queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders })
        },
    })
}

// Cancel order
export const useCancelOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: string; data: CancelOrderRequest }) =>
            ordersApi.cancelOrder(orderId, data),
        onSuccess: (response, variables) => {
            // Invalidate user orders
            queryClient.invalidateQueries({ queryKey: queryKeys.userOrders(variables.data.userId) })
            // Invalidate specific order
            if (response.order?.orderCode) {
                queryClient.invalidateQueries({ queryKey: queryKeys.orderByCode(response.order.orderCode) })
            }
            // Invalidate all orders (for admin)
            queryClient.invalidateQueries({ queryKey: queryKeys.orders })
            queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders })
        },
    })
}

// Verify VNPay payment
export const useVerifyVNPayPayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (query: string) => ordersApi.verifyVNPayPayment(query),
        onSuccess: (response) => {
            // Get userId from localStorage
            const userId = localStorage.getItem('userId')

            // Invalidate user orders
            if (userId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.userOrders(userId) })
            }

            // Invalidate specific order
            const orderCode = response.order?.orderCode || response.data?.orderCode
            if (orderCode) {
                queryClient.invalidateQueries({ queryKey: queryKeys.orderByCode(orderCode) })
            }

            // IMPORTANT: Invalidate admin orders to trigger refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.orders })
            queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders })
        },
    })
}
