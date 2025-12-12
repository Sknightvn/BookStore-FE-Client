export interface ReturnStatusHistory {
    status: string
    updatedBy: string
    updatedByName: string
    updatedAt: string
    _id: string
}

export interface ReturnRequestedBy {
    _id: string
    name: string
    email: string
    id: string
}

export interface ReturnItem {
    productId: string
    title: string
    price: number
    quantity: number
    total: number
    image: string
    _id: string
}

export interface ReturnRequest {
    _id: string
    orderId: string
    requestedBy: string | ReturnRequestedBy
    reason: string
    description: string
    images: string[]
    status: string
    statusHistory: ReturnStatusHistory[]
    requestedAt: string
    createdAt: string
    updatedAt: string
    __v: number
    subtotal?: number
    shippingFee?: number
    tax?: number
    total?: number
    items?: ReturnItem[]
}

export interface ReturnResponse {
    success: boolean
    data: ReturnRequest
    message?: string
}
