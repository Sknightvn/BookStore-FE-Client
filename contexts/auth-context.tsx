"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {
  loginUser,
  logoutUser,
  sendOtpForRegistration,
  verifyOtpAndRegister,
} from "@/utils/authApi"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone : string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  sendOtp: (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message: string }>
  verifyOtp: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; token?: string; user?: User; message?: string }>
  isLoading: boolean
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("bookstore_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("bookstore_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await loginUser(email, password)
      if (result.success && result.user) {
        const userData: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          avatar: result.user.avatar,
          phone : result.user.phone
        }
        setUser(userData)
        localStorage.setItem("bookstore_user", JSON.stringify(userData))
        setIsLoading(false)
        return { success: true, message: "Đăng nhập thành công!" }
      } else {
        setIsLoading(false)
        return { success: false, message: "Đăng nhập thất bại!" }
      }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Email hoặc mật khẩu không đúng!",
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bookstore_user")
    localStorage.removeItem("bookstore_token")
    logoutUser()
  }

  const sendOtp = async (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => {
    setIsLoading(true)
    try {
      const result = await sendOtpForRegistration(fullName, email, phone, password, confirmPassword)
      setIsLoading(false)
      return result
    } catch (error) {
      setIsLoading(false)
      return { success: false, message: error instanceof Error ? error.message : "Gửi OTP thất bại" }
    }
  }

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true)
    try {
      const result = await verifyOtpAndRegister(email, otp)
      if (result.success && result.user) {
        const userData: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          avatar: result.user.avatar,
            phone : result.user.phone
        }
        setUser(userData)
        localStorage.setItem("bookstore_user", JSON.stringify(userData))
      }
      setIsLoading(false)
      return result
    } catch (error) {
      setIsLoading(false)
      return { success: false, message: error instanceof Error ? error.message : "Xác thực OTP thất bại" }
    }
  }

  const isAuthenticated = () => !!user

  return (
    <AuthContext.Provider
      value={{ user, login, logout, sendOtp, verifyOtp, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
