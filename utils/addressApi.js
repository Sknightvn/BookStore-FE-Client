import axios from "axios";
import { API_URL } from "@/lib/config";
axios.defaults.withCredentials = true;

// 🏠 Thêm địa chỉ mới
export const addCustomerAddress = async (customerId, { street, ward, district, city }) => {
  try {
    const res = await axios.post(`${API_URL}/customer/add-address`, {
      customerId,
      street,  // Gửi các trường riêng biệt
      ward,
      district,
      city,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi thêm địa chỉ:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể thêm địa chỉ khách hàng",
    };
  }
};

// lấy customer theo id của user
export const getCustomerByUserId = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/customer/user/${userId}`);
  
    return res.data; // { success, data: customer }
  } catch (error) {
    console.error("❌ Lỗi khi lấy customer:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể lấy thông tin khách hàng",
    };
  }
};
// 📋 Lấy danh sách địa chỉ (chưa bị xóa)
export const getActiveAddresses = async (customerId) => {
  try {
    const res = await axios.get(`${API_URL}/customer/addresses/${customerId}`);
    return res.data; // { success, addresses }
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách địa chỉ:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể lấy danh sách địa chỉ",
    };
  }
};

// ✏️ Cập nhật địa chỉ theo index
export const updateAddress = async (customerId, index, newAddress) => {
  try {
    const res = await axios.put(`${API_URL}/customer/update-address`, {
      customerId,
      index,
      newAddress,
    });
    return res.data; // { success, message, addresses }
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật địa chỉ:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể cập nhật địa chỉ khách hàng",
    };
  }
};

// 🗑️ Xóa mềm (ẩn địa chỉ)
export const softDeleteAddress = async (customerId, index) => {
  try {
    const res = await axios.put(`${API_URL}/customer/soft-delete-address`, {
      customerId,
      index,
    });
    return res.data; // { success, message, addresses }
  } catch (error) {
    console.error("❌ Lỗi khi ẩn địa chỉ:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể ẩn địa chỉ khách hàng",
    };
  }
};
