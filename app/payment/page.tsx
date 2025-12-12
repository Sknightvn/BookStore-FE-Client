// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { CreditCard, Truck, Clock } from "lucide-react"
// import { useCart } from "@/contexts/cart-context"
// import { message } from "antd"
// import { useAuth } from "@/contexts/auth-context"
// import { CheckoutData } from "@/lib/orders-data"

// export default function PaymentPage() {
//   const router = useRouter()
//   const { clearCart } = useCart()
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
//   const [orderId, setOrderId] = useState<string>("")
//   const { user } = useAuth()

//   useEffect(() => {
//     const savedCheckoutData = localStorage.getItem("checkoutData")
//     if (!savedCheckoutData) {
//       message.error("Không tìm thấy thông tin đơn hàng!")
//       router.push("/cart")
//       return
//     }

//     const data = JSON.parse(savedCheckoutData)
//     setCheckoutData(data)

//     // Generate order ID
//     const newOrderId = `ORD-${Date.now()}`
//     setOrderId(newOrderId)
//   }, [router])

//   const handleConfirmPayment = async () => {
//     if (!checkoutData) return

//     setIsProcessing(true)

//     try {
//       // Chờ trong 2 giây để mô phỏng quá trình xử lý
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       // Tạo đối tượng items để gửi lên BE
//       const orderItems = checkoutData.items.map((item) => ({
//         productId: item.product.id,
//         title: item.product.title,
//         price: item.product.price,
//         quantity: item.quantity,
//         image: item.product.coverImage,
//       }))

//       // Dữ liệu gửi lên BE
//       const orderData = {
//         orderCode: orderId,
//         user: user?.id,
//         items: orderItems,
//         shippingAddress: checkoutData.shippingAddress,
//         subtotal: checkoutData.subtotal,
//         shippingFee: checkoutData.shippingFee,
//         tax: checkoutData.tax,
//         total: checkoutData.total,
//         paymentMethod: checkoutData.paymentMethod,
//       }

//       // Gửi yêu cầu POST lên BE (giả sử endpoint là /api/order)
//       const response = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderData),
//       })

//       const result = await response.json()

//       if (result.success) {
//         message.success("Thanh toán thành công!")

//         // Lưu đơn hàng vào localStorage
//         const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
//         existingOrders.push(result.order) // Đảm bảo BE trả về đơn hàng đã được tạo
//         localStorage.setItem("orders", JSON.stringify(existingOrders))

//         // Xóa giỏ hàng và dữ liệu thanh toán
//         clearCart()
//         localStorage.removeItem("checkoutData")
//         localStorage.removeItem("selectedDeliveryAddress")

//         // Chuyển hướng tới trang xác nhận đơn hàng
//         router.push(`/order-confirmation?orderId=${orderId}`)
//       } else {
//         message.error(result.message || "Không thể tạo đơn hàng. Vui lòng thử lại!")
//       }
//     } catch (error) {
//       console.error("Lỗi thanh toán:", error)
//       message.error("Có lỗi xảy ra. Vui lòng thử lại!")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   if (!checkoutData) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         <Card>
//           <CardContent className="py-12 text-center">
//             <p className="text-gray-600">Đang tải thông tin...</p>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Xác nhận thanh toán</h1>
//         <p className="text-gray-600 mt-2">Mã đơn hàng: {orderId}</p>
//       </div>

//       <div className="space-y-6">
//         {/* Payment Method Info */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <CreditCard className="w-5 h-5" />
//               <span>Phương thức thanh toán</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {checkoutData.paymentMethod === "cod" ? (
//               <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <Clock className="w-6 h-6 text-green-600" />
//                   <div>
//                     <p className="font-medium text-green-900">Thanh toán khi nhận hàng (COD)</p>
//                     <p className="text-sm text-green-700">Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng từ shipper</p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="flex items-center space-x-3 mb-3">
//                   <CreditCard className="w-6 h-6 text-blue-600" />
//                   <p className="font-medium text-blue-900">Chuyển khoản ngân hàng</p>
//                 </div>
//                 <div className="text-sm text-blue-800 space-y-1 ml-9">
//                   <p>
//                     <strong>Ngân hàng:</strong> Vietcombank2
//                   </p>
//                   <p>
//                     <strong>Số tài khoản:</strong> 1234567890
//                   </p>
//                   <p>
//                     <strong>Chủ tài khoản:</strong> BOOKSTORE VIETNAM
//                   </p>
//                   <p>
//                     <strong>Nội dung:</strong> {orderId} - {checkoutData.shippingAddress.fullName}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Shipping Address */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Địa chỉ giao hàng</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2 text-sm">
//               <p>
//                 <strong>Người nhận:</strong> {checkoutData.shippingAddress.fullName}
//               </p>
//               <p>
//                 <strong>Số điện thoại:</strong> {checkoutData.shippingAddress.phone}
//               </p>
//               <p>
//                 <strong>Email:</strong> {checkoutData.shippingAddress.email}
//               </p>
//               <p>
//                 <strong>Địa chỉ:</strong> {checkoutData.shippingAddress.address}, {checkoutData.shippingAddress.ward},{" "}
//                 {checkoutData.shippingAddress.district}, {checkoutData.shippingAddress.city}
//               </p>
//               {checkoutData.shippingAddress.notes && (
//                 <p>
//                   <strong>Ghi chú:</strong> {checkoutData.shippingAddress.notes}
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Order Summary */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Tóm tắt đơn hàng</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* Items */}
//             <div className="space-y-3">
//               {checkoutData.items.map((item) => (
//                 <div key={item.product.id} className="flex items-center justify-between text-sm">
//                   <div className="flex-1">
//                     <p className="font-medium">{item.product.title}</p>
//                     <p className="text-gray-600">
//                       {item.quantity} × {item.product.price.toLocaleString("vi-VN")}đ
//                     </p>
//                   </div>
//                   <p className="font-medium">{(item.product.price * item.quantity).toLocaleString("vi-VN")}đ</p>
//                 </div>
//               ))}
//             </div>

//             <Separator />

//             {/* Price Breakdown */}
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Tạm tính</span>
//                 <span>{checkoutData.subtotal.toLocaleString("vi-VN")}đ</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="flex items-center space-x-1">
//                   <Truck className="w-4 h-4" />
//                   <span>Phí vận chuyển</span>
//                 </span>
//                 <span>
//                   {checkoutData.shippingFee === 0 ? "Miễn phí" : `${checkoutData.shippingFee.toLocaleString("vi-VN")}đ`}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Thuế VAT (10%)</span>
//                 <span>{checkoutData.tax.toLocaleString("vi-VN")}đ</span>
//               </div>
//             </div>

//             <Separator />

//             <div className="flex justify-between text-lg font-bold">
//               <span>Tổng cộng</span>
//               <span className="text-red-600">{checkoutData.total.toLocaleString("vi-VN")}đ</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Confirm Button */}
//         <Button
//           onClick={handleConfirmPayment}
//           disabled={isProcessing}
//           className="w-full bg-blue-600 hover:bg-blue-700"
//           size="lg"
//         >
//           {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
//         </Button>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Truck, Clock } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"
import { useAuth } from "@/contexts/auth-context"
import { CheckoutData } from "@/lib/orders-data"
import { useCreateOrder, useCreateVNPayOrder } from "@/hooks/useOrders"

export default function PaymentPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [orderId, setOrderId] = useState<string>("")
  const { user } = useAuth()

  const createOrderMutation = useCreateOrder()
  const createVNPayOrderMutation = useCreateVNPayOrder()

  useEffect(() => {
    const savedCheckoutData = localStorage.getItem("checkoutData")
    if (!savedCheckoutData) {
      message.error("Không tìm thấy thông tin đơn hàng!")
      router.push("/cart")
      return
    }

    const data = JSON.parse(savedCheckoutData)
    setCheckoutData(data)
    const newOrderId = `ORD-${Date.now()}`
    setOrderId(newOrderId)
  }, [router])

  const handleConfirmPayment = async () => {
    if (!checkoutData) return
    setIsProcessing(true)

    try {
      // Chuẩn bị dữ liệu gửi BE
      const orderItems = checkoutData.items.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.coverImage,
      }))

      const orderData = {
        orderCode: orderId,
        user: user?.id || "",
        items: orderItems,
        shippingAddress: checkoutData.shippingAddress,
        subtotal: checkoutData.subtotal,
        shippingFee: checkoutData.shippingFee,
        tax: checkoutData.tax,
        total: checkoutData.total,
        paymentMethod: checkoutData.paymentMethod,
      }

      // Nếu chọn thanh toán COD
      if (checkoutData.paymentMethod === "cod") {
        createOrderMutation.mutate(orderData, {
          onSuccess: () => {
            message.success("Đặt hàng thành công (COD)!")
            clearCart()
            localStorage.removeItem("checkoutData")
            router.push(`/order-confirmation?orderId=${orderId}`)
          },
          onError: (error: any) => {
            message.error(error.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại!")
          },
          onSettled: () => {
            setIsProcessing(false)
          },
        })
        return
      }

      // ✅ Nếu chọn thanh toán qua VNPay
      createVNPayOrderMutation.mutate(orderData, {
        onSuccess: (result) => {
          if (result.paymentUrl) {
            // Chuyển hướng sang trang VNPay
            window.location.href = result.paymentUrl
          } else {
            message.error("Không tạo được link thanh toán VNPay!")
            setIsProcessing(false)
          }
        },
        onError: (error: any) => {
          console.error("Lỗi thanh toán:", error)
          message.error("Có lỗi xảy ra khi thanh toán!")
          setIsProcessing(false)
        },
      })
    } catch (error) {
      console.error("Lỗi thanh toán:", error)
      message.error("Có lỗi xảy ra khi thanh toán!")
      setIsProcessing(false)
    }
  }

  if (!checkoutData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Đang tải thông tin...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Xác nhận thanh toán</h1>
        <p className="text-gray-600 mt-2">Mã đơn hàng: {orderId}</p>
      </div>

      <div className="space-y-6">
        {/* Payment Method Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Phương thức thanh toán</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {checkoutData.paymentMethod === "cod" ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-green-700">Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <p className="font-medium text-blue-900">Thanh toán qua VNPay</p>
                </div>
                <div className="text-sm text-blue-800 ml-9">
                  <p>Bạn sẽ được chuyển hướng tới cổng thanh toán VNPay để hoàn tất giao dịch.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tổng kết đơn hàng */}
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkoutData.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>
                  {item.product.title} × {item.quantity}
                </span>
                <span>{(item.product.price * item.quantity).toLocaleString("vi-VN")}đ</span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <span className="text-red-600">{checkoutData.total.toLocaleString("vi-VN")}đ</span>
            </div>
          </CardContent>
        </Card>

        {/* Confirm button */}
        <Button
          onClick={handleConfirmPayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </Button>
      </div>
    </div>
  )
}
