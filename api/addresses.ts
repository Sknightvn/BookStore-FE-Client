import axiosInstance from '@/lib/axios'
import type {
    AddAddressRequest,
    UpdateAddressRequest,
    DeleteAddressRequest,
} from '@/interface/request/address'
import type { AddressesResponse, AddressResponse } from '@/interface/response/address'

// Get customer addresses
export const getCustomerAddresses = async (customerId: string): Promise<AddressesResponse> => {
    const response = await axiosInstance.get(`/customer/addresses/${customerId}`)
    return response.data
}

// Add customer address
export const addCustomerAddress = async (data: AddAddressRequest): Promise<AddressResponse> => {
    const response = await axiosInstance.post('/customer/add-address', data)
    return response.data
}

// Update address
export const updateAddress = async (data: UpdateAddressRequest): Promise<AddressResponse> => {
    const response = await axiosInstance.put('/customer/update-address', data)
    return response.data
}

// Soft delete address
export const deleteAddress = async (data: DeleteAddressRequest): Promise<AddressResponse> => {
    const response = await axiosInstance.put('/customer/soft-delete-address', data)
    return response.data
}
