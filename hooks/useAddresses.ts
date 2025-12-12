import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as addressesApi from '@/api/addresses'
import type {
    AddAddressRequest,
    UpdateAddressRequest,
    DeleteAddressRequest,
} from '@/interface/request/address'

// Get customer addresses
export const useCustomerAddresses = (customerId: string) => {
    return useQuery({
        queryKey: queryKeys.addresses(customerId),
        queryFn: () => addressesApi.getCustomerAddresses(customerId),
        enabled: !!customerId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

// Add address
export const useAddAddress = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: AddAddressRequest) => addressesApi.addCustomerAddress(data),
        onSuccess: (_, variables) => {
            // Invalidate addresses for this customer
            queryClient.invalidateQueries({ queryKey: queryKeys.addresses(variables.customerId) })
        },
    })
}

// Update address
export const useUpdateAddress = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateAddressRequest) => addressesApi.updateAddress(data),
        onSuccess: (_, variables) => {
            // Invalidate addresses for this customer
            queryClient.invalidateQueries({ queryKey: queryKeys.addresses(variables.customerId) })
        },
    })
}

// Delete address
export const useDeleteAddress = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeleteAddressRequest) => addressesApi.deleteAddress(data),
        onSuccess: (_, variables) => {
            // Invalidate addresses for this customer
            queryClient.invalidateQueries({ queryKey: queryKeys.addresses(variables.customerId) })
        },
    })
}
