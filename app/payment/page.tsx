"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { IconCreditCard, IconTruck, IconClock, IconShoppingCart } from "@tabler/icons-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"
import { useAuth } from "@/contexts/auth-context"
import { CheckoutData } from "@/lib/orders-data"
import { useCreateOrder, useCreateVNPayOrder } from "@/hooks/useOrders"
import { useUpdateUserCart } from "@/hooks/useCart"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"

export default function PaymentPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [orderId, setOrderId] = useState<string>("")
  const { user } = useAuth()

  const createOrderMutation = useCreateOrder()
  const createVNPayOrderMutation = useCreateVNPayOrder()
  const updateCartMutation = useUpdateUserCart()
  const queryClient = useQueryClient()

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

      const clearCartCompletely = async () => {
        clearCart()

        const cartKey = user?.id ? `cartItems_${user.id}` : "cartItems_guest"
        localStorage.removeItem(cartKey)
        localStorage.removeItem("checkoutData")
        localStorage.removeItem("selectedDeliveryAddress")

        if (user?.id || user?.email) {
          const cacheKey = user?.id || user?.email || ''
          queryClient.setQueryData(queryKeys.userCart(cacheKey), { success: true, data: [] })
          await queryClient.invalidateQueries({ queryKey: queryKeys.userCart(cacheKey) })

          const result = await updateCartMutation.mutateAsync({
            userId: user?.id,
            email: user?.email,
            productsCart: [],
          })
        }
      }

      if (checkoutData.paymentMethod === "cod") {
        createOrderMutation.mutate(orderData, {
          onSuccess: () => {
            message.success("Đặt hàng thành công (COD)!")
            clearCartCompletely()
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

      createVNPayOrderMutation.mutate(orderData, {
        onSuccess: (result) => {
          clearCartCompletely()
          if (result.paymentUrl) {
            window.location.href = result.paymentUrl!
          } else {
            // message.error("Không tạo được link thanh toán VNPay!")
            setIsProcessing(false)
          }
        },
        onError: (error: any) => {
          console.error("Lỗi thanh toán:", error)
          // message.error("Có lỗi xảy ra khi thanh toán!")
          setIsProcessing(false)
        },
      })
    } catch (error) {
      console.error("Lỗi thanh toán:", error)
      // message.error("Có lỗi xảy ra khi thanh toán!")
      setIsProcessing(false)
    }
  }

  if (!checkoutData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-indigo-950">Đang tải thông tin...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cart">Giỏ hàng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/checkout">Thanh toán</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thanh toán</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Xác nhận thanh toán</h1>
          <p className="text-indigo-950 mt-2">Mã đơn hàng: {orderId}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Payment Method Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <IconCreditCard size={20} />
              <span>Phương thức thanh toán</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {checkoutData.paymentMethod === "cod" ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <IconClock size={24} className="text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-green-700">Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <IconCreditCard size={24} className="text-indigo-600" />
                  <p className="font-medium text-indigo-900">Thanh toán qua VNPay</p>
                </div>
                <div className="text-sm text-indigo-800 ml-9">
                  <p>Bạn sẽ được chuyển hướng tới cổng thanh toán VNPay để hoàn tất giao dịch.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tổng kết đơn hàng */}
        <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
          <CardHeader className="bg-indigo-100">
            <CardTitle className="flex items-center space-x-2">
              <IconShoppingCart size={20} className="text-indigo-700" />
              <span className="text-lg text-indigo-700">Tóm tắt đơn hàng</span>
            </CardTitle>
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
              <span className="text-red-500">{checkoutData.total.toLocaleString("vi-VN")}đ</span>
            </div>
          </CardContent>
        </Card>

        {/* Confirm button */}
        <Button
          onClick={handleConfirmPayment}
          disabled={isProcessing}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          size="lg"
        >
          {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </Button>
      </div>
    </div>
  )
}
