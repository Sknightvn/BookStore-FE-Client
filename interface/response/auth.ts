export interface User {
    id: string
    name: string
    email: string
    role: string
}

export interface AuthResponse {
    success: boolean
    token?: string
    user?: User
    message?: string
    error?: string
}

export interface OtpResponse {
    success: boolean
    message: string
}

export interface UserResponse {
    success: boolean
    data?: User
    message?: string
}
