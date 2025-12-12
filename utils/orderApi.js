import axios from "axios"
import { API_URL } from "@/lib/config"

// 👉 Tạo instance axios chung (có thể thêm token sau này)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// ===============================
// 🧾 API ĐẶT HÀNG
// ===============================
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData)
    return response.data
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error)
    throw error.response ? error.response.data : error
  }
}

// ===============================
// 👤 API KHÁCH HÀNG
// ===============================
export const getActiveAddresses = async (customerId) => {
  try {
    const response = await api.get(`/customers/${customerId}/addresses/active`)
    return response.data
  } catch (error) {
    console.error("❌ Lỗi lấy địa chỉ:", error)
    throw error.response ? error.response.data : error
  }
}
