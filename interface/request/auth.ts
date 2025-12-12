export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    fullName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}

export interface SendOtpRequest {
    fullName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}

export interface VerifyOtpRequest {
    email: string
    otp: string
}

export interface UpdatePasswordRequest {
    userId: string
    currentPassword: string
    newPassword: string
}
