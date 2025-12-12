import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import * as authApi from '@/api/auth'
import type {
    LoginRequest,
    SendOtpRequest,
    VerifyOtpRequest,
    UpdatePasswordRequest,
} from '@/interface/request/auth'

// Login mutation
export const useLogin = () => {
    return useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.loginUser(credentials),
        onSuccess: (data) => {
            if (data.success && data.token && data.user) {
                // Save to localStorage
                localStorage.setItem('token', data.token)
                localStorage.setItem('userRole', data.user.role)
                localStorage.setItem('userName', data.user.name)
                localStorage.setItem('userEmail', data.user.email)
                localStorage.setItem('userId', data.user.id)
                localStorage.setItem('isAuthenticated', 'true')
            }
        },
    })
}

// Send OTP mutation
export const useSendOtp = () => {
    return useMutation({
        mutationFn: (data: SendOtpRequest) => authApi.sendOtpForRegistration(data),
    })
}

// Verify OTP mutation
export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: (data: VerifyOtpRequest) => authApi.verifyOtpAndRegister(data),
        onSuccess: (data) => {
            if (data.success && data.token && data.user) {
                // Save to localStorage
                localStorage.setItem('token', data.token)
                localStorage.setItem('userRole', data.user.role)
                localStorage.setItem('userName', data.user.name)
                localStorage.setItem('userEmail', data.user.email)
                localStorage.setItem('userId', data.user.id)
                localStorage.setItem('isAuthenticated', 'true')
            }
        },
    })
}

// Get user profile query
export const useUserProfile = (token?: string) => {
    return useQuery({
        queryKey: queryKeys.userProfile(token),
        queryFn: () => authApi.getUserProfile(token),
        enabled: !!token || !!localStorage.getItem('token'),
    })
}

// Update password mutation
export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: (data: UpdatePasswordRequest) => authApi.updatePassword(data),
    })
}

// Forgot password mutation
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => authApi.forgotPassword(email),
    })
}

// Logout mutation
export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => authApi.logoutUser(),
        onSuccess: () => {
            // Clear localStorage
            localStorage.clear()
            // Clear all queries
            queryClient.clear()
        },
    })
}
