import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as customersApi from '@/api/customers'

// Get customer by user ID
export const useCustomerByUserId = (userId: string) => {
    return useQuery({
        queryKey: queryKeys.customer(userId),
        queryFn: () => customersApi.getCustomerByUserId(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
