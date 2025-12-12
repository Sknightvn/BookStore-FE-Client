"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, MapPin, CreditCard, Package } from "lucide-react"
import type { Order } from "@/lib/orders-data"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push("/cart")
      return
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.id === orderId)

    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      router.push("/cart")
    }

    setIsLoading(false)
  }, [orderId, router])

  if (isLoading) {
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

  if (!order) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng đã được tạo thành công!</h1>
        <p className="text-gray-600">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi</p>
      </div>

      <div className="space-y-6">
        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Mã đơn hàng</p>
                <p className="font-bold text-lg">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                <p className="font-bold">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Trạng thái đơn hàng</p>
                  <p className="text-sm text-blue-700">
                    {order.status === "pending"
                      ? "Chờ xác nhận"
                      : order.status === "confirmed"
                        ? "Đã xác nhận"
                        : order.status === "shipped"
                          ? "Đang giao"
                          : order.status === "delivered"
                            ? "Đã giao"
                            : "Đã hủy"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Địa chỉ giao hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Người nhận:</strong> {order.shippingAddress.fullName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {order.shippingAddress.phone}
              </p>
              <p>
                <strong>Email:</strong> {order.shippingAddress.email}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {order.shippingAddress.address}, {order.shippingAddress.ward},{" "}
                {order.shippingAddress.district}, {order.shippingAddress.city}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Phương thức thanh toán</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
            </p>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-600">
                    {item.quantity} × {item.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <p className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
              </div>
            ))}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{order.subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{order.shippingFee === 0 ? "Miễn phí" : `${order.shippingFee.toLocaleString("vi-VN")}đ`}</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế VAT (10%)</span>
                <span>{order.tax.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <span className="text-red-600">{order.total.toLocaleString("vi-VN")}đ</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
          <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Link href="/orders">Xem đơn hàng của tôi</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
