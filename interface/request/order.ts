export interface OrderItem {
    productId: string
    title: string
    price: number
    quantity: number
    image?: string
}

export interface ShippingAddress {
    fullName: string
    phone: string
    email: string
    address: string
    ward: string
    district: string
    city: string
    notes?: string
}

export interface CreateOrderRequest {
    orderCode: string
    user: string
    items: OrderItem[]
    shippingAddress: ShippingAddress
    subtotal: number
    shippingFee: number
    tax: number
    total: number
    paymentMethod: string
}

export interface CancelOrderRequest {
    userId: string
    userName: string
}
