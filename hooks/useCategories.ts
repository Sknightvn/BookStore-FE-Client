import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as categoriesApi from '@/api/categories'

export const useCategories = () => {
    return useQuery({
        queryKey: queryKeys.categories,
        queryFn: () => categoriesApi.getCategories(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

