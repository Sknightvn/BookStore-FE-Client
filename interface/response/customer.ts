export interface Customer {
    _id: string
    userId: string
    name: string
    email: string
    phone: string
    addresses?: any[]
}

export interface CustomerResponse {
    success: boolean
    data?: Customer
    message?: string
}
