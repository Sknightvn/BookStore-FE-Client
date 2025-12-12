import axios from "axios";
import { API_URL } from "@/lib/config";
export interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  address: string
  ward: string
  district: string
  city: string
  notes?: string
}

export interface OrderItem {
  productId: string
  title: string
  author?: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: "cod" | "bank_transfer"
  subtotal: number
  shippingFee: number
  tax: number
  total: number
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipping"
    | "delivered"
    | "completed"
    | "refunded"
    | "cancelled"
    | "pending_payment"
    | "shipped"
  createdAt: Date
  updatedAt: Date
  notes?: string
  refundReason?: string
  refundDate?: Date
  completedDate?: Date
}

export interface CheckoutData {
  items: any[]
  shippingAddress: ShippingAddress
  subtotal: number
  shippingFee: number
  tax: number
  total: number
  paymentMethod: "cod" | "bank_transfer"
  customerId?: string // 👈 thêm để liên kết với customer
}

// ===============================
// ⚙️ Helper functions
// ===============================
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `BK${timestamp.slice(-6)}${random}`
}

// ===============================
// 💾 MOCK LOCAL STORAGE (fallback khi không có API)
// ===============================
// export function createSampleOrders(): void {
//   const sampleOrders: Order[] = [
//     {
//       id: "1",
//       orderNumber: "BK123456ABC",
//       items: [
//         {
//           productId: "1",
//           title: "Đắc Nhân Tâm",
//           author: "Dale Carnegie",
//           price: 89000,
//           quantity: 1,
//           image: "/dac-nhan-tam-book-cover.png",
//         },
//       ],
//       shippingAddress: {
//         fullName: "Nguyễn Văn A",
//         phone: "0123456789",
//         email: "user@example.com",
//         address: "123 Đường ABC",
//         ward: "Phường 1",
//         district: "Quận 1",
//         city: "TP.HCM",
//       },
//       paymentMethod: "cod",
//       subtotal: 89000,
//       shippingFee: 0,
//       tax: 8900,
//       total: 97900,
//       status: "completed",
//       createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//       updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//       completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//     },
//     {
//       id: "2",
//       orderNumber: "BK789012DEF",
//       items: [
//         {
//           productId: "2",
//           title: "Sapiens: Lược sử loài người",
//           author: "Yuval Noah Harari",
//           price: 156000,
//           quantity: 1,
//           image: "/sapiens-book-cover.png",
//         },
//       ],
//       shippingAddress: {
//         fullName: "Trần Thị B",
//         phone: "0987654321",
//         email: "user2@example.com",
//         address: "456 Đường XYZ",
//         ward: "Phường 2",
//         district: "Quận 2",
//         city: "TP.HCM",
//       },
//       paymentMethod: "bank_transfer",
//       subtotal: 156000,
//       shippingFee: 30000,
//       tax: 15600,
//       total: 201600,
//       status: "refunded",
//       createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
//       updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//       refundReason: "Sách bị lỗi in ấn",
//       refundDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//     },
//   ]

//   const existingOrders = getOrders()
//   if (existingOrders.length === 0) {
//     localStorage.setItem("bookstore_orders", JSON.stringify(sampleOrders))
//   }
// }
export async function createSampleOrders(): Promise<void> {
  try {
    // 1. Gọi API từ http://localhost:5000/api/orders/
    const response = await axios.get(`${API_URL}/orders`);

    // 2. Kiểm tra dữ liệu trả về từ API
    if (response.data.success && response.data.orders) {
      const orders: Order[] = response.data.orders.map((order: any) => ({
        id: order._id,
        orderNumber: order.orderCode,
        items: order.items.map((item: any) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        image: item.image ? item.image : "/default-image.png"
        })),
        shippingAddress: {
          fullName: order.shippingAddress.fullName,
          phone: order.shippingAddress.phone,
          email: order.shippingAddress.email,
          address: order.shippingAddress.address,
          ward: order.shippingAddress.ward,
          district: order.shippingAddress.district,
          city: order.shippingAddress.city,
          notes: order.shippingAddress.notes,
        },
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        tax: order.tax,
        total: order.total,
        status: order.status,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        notes: order.notes,
        refundReason: order.refundReason,
        refundDate: order.refundDate ? new Date(order.refundDate) : undefined,
        completedDate: order.completedDate ? new Date(order.completedDate) : undefined,
      }));

      // 3. Lưu dữ liệu vào localStorage
      const existingOrders = getOrders();
      if (existingOrders.length === 0) {
        localStorage.setItem("bookstore_orders", JSON.stringify(orders));
      } else {
        // Có thể thực hiện gộp với các đơn hàng hiện có
        localStorage.setItem("bookstore_orders", JSON.stringify(existingOrders.concat(orders)));
      }

      console.log("Dữ liệu đã được nhập thành công!");
    } else {
      console.error("Dữ liệu không hợp lệ từ API");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API hoặc lưu dữ liệu:", error);
  }
}

// ===============================
// 📖 LOCAL STORAGE utilities (mock mode)
// ===============================
export function saveOrder(order: Order): void {
  const existingOrders = getOrders()
  existingOrders.push(order)
  localStorage.setItem("bookstore_orders", JSON.stringify(existingOrders))
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return []
  const orders = localStorage.getItem("bookstore_orders")
  if (!orders) return []
  try {
    return JSON.parse(orders).map((order: any) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      refundDate: order.refundDate ? new Date(order.refundDate) : undefined,
      completedDate: order.completedDate ? new Date(order.completedDate) : undefined,
    }))
  } catch {
    return []
  }
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  const orders = getOrders()
  return orders.find((order) => order.orderNumber === orderNumber)
}

export function updateOrderStatus(
  orderNumber: string,
  status: Order["status"],
  additionalData?: { refundReason?: string },
): void {
  const orders = getOrders()
  const index = orders.findIndex((o) => o.orderNumber === orderNumber)
  if (index !== -1) {
    orders[index].status = status
    orders[index].updatedAt = new Date()

    if (status === "completed") orders[index].completedDate = new Date()
    if (status === "refunded" && additionalData?.refundReason) {
      orders[index].refundReason = additionalData.refundReason
      orders[index].refundDate = new Date()
    }

    localStorage.setItem("bookstore_orders", JSON.stringify(orders))
  }
}

export function getOrdersByUserEmail(email: string): Order[] {
  const orders = getOrders()
  return orders.filter((order) => order.shippingAddress.email === email)
}
