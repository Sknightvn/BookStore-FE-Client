import axiosInstance from '@/lib/axios'
import type {
    LoginRequest,
    RegisterRequest,
    SendOtpRequest,
    VerifyOtpRequest,
    UpdatePasswordRequest,
} from '@/interface/request/auth'
import type { AuthResponse, OtpResponse, UserResponse } from '@/interface/response/auth'

// Login
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/customer/login', credentials)
    return response.data
}

// Send OTP for registration
export const sendOtpForRegistration = async (data: SendOtpRequest): Promise<OtpResponse> => {
    const response = await axiosInstance.post('/customer/send-otp', data)
    return response.data
}

// Verify OTP and complete registration
export const verifyOtpAndRegister = async (data: VerifyOtpRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/customer/verify-otp', data)
    return response.data
}

// Get user profile
export const getUserProfile = async (token?: string): Promise<UserResponse> => {
    const response = await axiosInstance.get('/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return response.data
}

// Update password
export const updatePassword = async (data: UpdatePasswordRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/updatepassword', data)
    return response.data
}

// Forgot password
export const forgotPassword = async (email: string): Promise<any> => {
    const response = await axiosInstance.post('/auth/forgotpassword', { email })
    return response.data
}

// Logout
export const logoutUser = async (): Promise<void> => {
    await axiosInstance.get('/auth/logout')
}
