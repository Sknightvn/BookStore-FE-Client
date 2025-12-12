import axios from "axios"
import { API_URL } from "@/lib/config"

// Tự động gửi cookie khi cần
axios.defaults.withCredentials = true

// ===============================
// 🔹 LOGIN
// ===============================
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/customer/login`, { email, password })

    if (response.data.success && response.data.token) {
      const { token, user } = response.data

      // ✅ Lưu thông tin vào localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("userRole", user.role)
      localStorage.setItem("userName", user.name)
      localStorage.setItem("userEmail", user.email)
      localStorage.setItem("userId", user.id)
      localStorage.setItem("isAuthenticated", "true")

      // ✅ Gán token cho axios
      setAuthToken(token)

      return { success: true, token, user }
    } else {
      throw new Error("Đăng nhập thất bại.")
    }
  } catch (error) {
    console.error("Login error:", error.response || error)
    throw new Error(error.response?.data?.error || "Đăng nhập thất bại.")
  }
}

// ===============================
// 🔹 SEND OTP → đăng ký tạm
// ===============================
export const sendOtpForRegistration = async (fullName, email, phone, password, confirmPassword) => {
  try {
    const response = await axios.post(`${API_URL}/customer/send-otp`, {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    })

    return {
      success: response.data.success,
      message: response.data.message,
    }
  } catch (error) {
    console.error("Send OTP error:", error.response || error)
    return {
      success: false,
      message: error.response?.data?.error || "Gửi OTP thất bại.",
    }
  }
}

// ===============================
// 🔹 VERIFY OTP → hoàn tất đăng ký
// ===============================
export const verifyOtpAndRegister = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/customer/verify-otp`, { email, otp })

    if (response.data.success) {
      const { token, user } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("userRole", user.role)
      localStorage.setItem("userName", user.name)
      localStorage.setItem("userEmail", user.email)
      localStorage.setItem("userId", user.id)
      localStorage.setItem("isAuthenticated", "true")

      setAuthToken(token)

      return { success: true, token, user }
    } else {
      return { success: false, message: response.data.message }
    }
  } catch (error) {
    console.error("Verify OTP error:", error.response || error)
    return {
      success: false,
      message: error.response?.data?.error || "Xác thực OTP thất bại.",
    }
  }
}

// ===============================
// 🔹 LẤY THÔNG TIN USER
// ===============================
export const getUserProfile = async (token) => {
  const useToken = token || localStorage.getItem("token")
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${useToken}` },
  })
  return response.data.data
}

// ===============================
// 🔹 LOGOUT
// ===============================
export const logoutUser = async () => {
  try {
    await axios.get(`${API_URL}/auth/logout`)
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    localStorage.clear()
    delete axios.defaults.headers.common["Authorization"]
  }
}

// ===============================
// 🔹 KIỂM TRA LOGIN
// ===============================
export const isAuthenticated = () => !!localStorage.getItem("token")
export const isAdmin = () => localStorage.getItem("userRole") === "admin"
export const isEmployee = () => localStorage.getItem("userRole") === "employee"

// ===============================
// 🔹 SET TOKEN CHO AXIOS
// ===============================
export const setAuthToken = (token) => {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  else delete axios.defaults.headers.common["Authorization"]
}

// ===============================
// 🔹 REGISTER (cũ, không dùng nữa nếu dùng OTP)
// ===============================
export const registerUser = async (fullName, email, phone, password, confirmPassword, role = "customer") => {
  return sendOtpForRegistration(fullName, email, phone, password, confirmPassword)
}
