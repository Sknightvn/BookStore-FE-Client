import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as returnsApi from '@/api/returns'
import type { ReturnRequestData } from '@/api/returns'

// Submit return request
export const useSubmitReturnRequest = () => {
    return useMutation({
        mutationFn: (data: ReturnRequestData) => returnsApi.submitReturnRequest(data),
    })
}

// Get return request by order ID
export const useReturnByOrderId = (orderId: string) => {
    return useQuery({
        queryKey: queryKeys.returnByOrderId(orderId),
        queryFn: () => returnsApi.getReturnByOrderId(orderId),
        enabled: !!orderId,
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 4 * 1000, // Auto-refetch every 4 seconds
    })
}
