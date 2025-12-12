import { Address } from '../request/address'

export interface AddressesResponse {
    success: boolean
    addresses: Address[]
    message?: string
}

export interface AddressResponse {
    success: boolean
    message: string
    addresses?: Address[]
}
