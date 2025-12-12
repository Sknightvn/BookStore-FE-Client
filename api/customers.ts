import axiosInstance from '@/lib/axios'
import type { CustomerResponse } from '@/interface/response/customer'

// Get customer by user ID
export const getCustomerByUserId = async (userId: string): Promise<CustomerResponse> => {
    const response = await axiosInstance.get(`/customer/user/${userId}`)
    return response.data
}
