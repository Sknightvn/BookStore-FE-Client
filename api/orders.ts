import axiosInstance from '@/lib/axios'
import type { CreateOrderRequest, CancelOrderRequest } from '@/interface/request/order'
import type { OrdersResponse, OrderResponse, VNPayResponse } from '@/interface/response/order'

// Create order (COD)
export const createOrder = async (data: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await axiosInstance.post('/orders', data)
    return response.data
}

// Create VNPay checkout
export const createVNPayOrder = async (data: CreateOrderRequest): Promise<VNPayResponse> => {
    const response = await axiosInstance.post('/orders/checkout', data)
    return response.data
}

// Get user orders
export const getUserOrders = async (userId: string): Promise<OrdersResponse> => {
    const response = await axiosInstance.get(`/orders/user/${userId}`)
    return response.data
}

// Get order by order code
export const getOrderByCode = async (code: string): Promise<OrderResponse> => {
    const response = await axiosInstance.get(`/orders/orderCode/${code}`)
    return response.data
}

// Cancel order
export const cancelOrder = async (
    orderId: string,
    data: CancelOrderRequest
): Promise<OrderResponse> => {
    const response = await axiosInstance.put(`/orders/status/cancelOrder/${orderId}`, data)
    return response.data
}

// Verify VNPay payment
export const verifyVNPayPayment = async (query: string): Promise<OrderResponse> => {
    const response = await axiosInstance.get(`/orders/vnpay_ipn?${query}`)
    return response.data
}
