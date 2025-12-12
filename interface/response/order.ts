import { OrderItem } from '../request/order'

export interface Order {
    _id: string
    orderCode: string
    status: string
    total: number
    createdAt: string
    paymentMethod: string
    items: OrderItem[]
    user?: string
    shippingAddress?: any
}

export interface OrdersResponse {
    success: boolean
    orders: Order[]
    message?: string
}

export interface OrderResponse {
    success: boolean
    order?: Order
    data?: Order
    message?: string
}

export interface VNPayResponse {
    success: boolean
    paymentUrl?: string
    message?: string
}
