"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { message } from "antd"
import { useCart } from "@/contexts/cart-context"
import { useVerifyVNPayPayment } from "@/hooks/useOrders"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const verifyPaymentMutation = useVerifyVNPayPayment()

  useEffect(() => {
    // Lấy toàn bộ query params từ URL trả về của VNPay
    const query = Object.fromEntries(searchParams.entries())

    if (Object.keys(query).length === 0) {
      message.error("Không có thông tin thanh toán!")
      router.push("/")
      return
    }

    // Gửi query params lên server để xác thực
    const queryString = new URLSearchParams(query).toString()

    verifyPaymentMutation.mutate(queryString, {
      onSuccess: (result) => {
        if (result.RspCode === "00") {
          message.success("Thanh toán thành công!")
          clearCart()
          localStorage.removeItem("checkoutData")
          router.push(`/order-confirmation?orderId=${query.vnp_TxnRef}`)
        } else {
          message.error("Thanh toán thất bại hoặc không hợp lệ!")
          router.push("/cart")
        }
      },
      onError: (error) => {
        message.error("Có lỗi xảy ra khi xác nhận thanh toán!")
        router.push("/cart")
      },
    })
  }, [searchParams, router, clearCart, verifyPaymentMutation])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-indigo-950 font-medium">Đang xác nhận thanh toán...</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-indigo-950 font-medium">Đang tải...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}