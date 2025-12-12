import { axiosInstance } from '@/lib/axios'
import type { ReturnResponse } from '@/interface/response/return'

export interface ReturnRequestData {
    orderId: string
    requestedBy: string
    reason: string
    description: string
    image: File
}

// Submit return request
export const submitReturnRequest = async (data: ReturnRequestData): Promise<any> => {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('orderId', data.orderId)
    formData.append('requestedBy', data.requestedBy)
    formData.append('reason', data.reason)
    formData.append('description', data.description)

    const response = await axiosInstance.post('/returns/return', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}

// Get return request by order ID
export const getReturnByOrderId = async (orderId: string): Promise<ReturnResponse> => {
    const response = await axiosInstance.get(`/returns/order/${orderId}`)
    return response.data
}
