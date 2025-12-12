export interface Address {
    street: string
    ward: string
    district: string
    city: string
    isDeleted?: boolean
}

export interface AddAddressRequest {
    customerId: string
    street: string
    ward: string
    district: string
    city: string
}

export interface UpdateAddressRequest {
    customerId: string
    index: number
    newAddress: Address
}

export interface DeleteAddressRequest {
    customerId: string
    index: number
}
