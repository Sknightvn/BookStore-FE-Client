"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconCircleCheck, IconMapPin, IconCreditCard, IconPackage } from "@tabler/icons-react"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-indigo-950 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-4 lg:px-8 py-8">
      <div className="mb-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/orders">Đơn hàng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chi tiết đơn hàng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Success Message */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <IconCircleCheck size={64} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-950 mb-2">Đơn hàng đã được tạo thành công!</h1>
          <p className="text-indigo-950">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Order Info */}
        <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
          <CardHeader className="bg-indigo-100">
            <CardTitle className="flex items-center space-x-2">
              <IconPackage size={20} className="text-indigo-700" />
              <span className="text-lg text-indigo-700">Thông tin đơn hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-indigo-950">Mã đơn hàng</p>
                <p className="font-bold text-lg">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-950">Ngày đặt hàng</p>
                <p className="font-bold">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <IconPackage size={20} className="text-indigo-600" />
                <div>
                  <p className="font-medium text-indigo-900">Trạng thái đơn hàng</p>
                  <p className="text-sm text-indigo-700">
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
        <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
          <CardHeader className="bg-indigo-100">
            <CardTitle className="flex items-center space-x-2">
              <IconMapPin size={20} className="text-indigo-700" />
              <span className="text-lg text-indigo-700">Địa chỉ giao hàng</span>
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
        <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
          <CardHeader className="bg-indigo-100">
            <CardTitle className="flex items-center space-x-2">
              <IconCreditCard size={20} className="text-indigo-700" />
              <span className="text-lg text-indigo-700">Phương thức thanh toán</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
            </p>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
          <CardHeader className="bg-indigo-100">
            <CardTitle className="flex items-center space-x-2">
              <IconPackage size={20} className="text-indigo-700" />
              <span className="text-lg text-indigo-700">Chi tiết đơn hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-indigo-950">
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
              <span className="text-red-500">{order.total.toLocaleString("vi-VN")}đ</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
          <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700">
            <Link href="/orders">Xem đơn hàng của tôi</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
