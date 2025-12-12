"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Copy, ArrowLeft, Home } from "lucide-react"
import { getOrderByNumber, type Order } from "@/lib/orders-data"
import { message } from "antd"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const orderNumber = searchParams.get("orderNumber")

  useEffect(() => {
    if (!orderNumber) {
      router.push("/")
      return
    }

    const foundOrder = getOrderByNumber(orderNumber)
    if (!foundOrder) {
      message.error("Không tìm thấy đơn hàng!")
      router.push("/")
      return
    }

    setOrder(foundOrder)
  }, [orderNumber, router])

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber)
      message.success("Đã sao chép mã đơn hàng!")
    }
  }

  const getPaymentMethodText = (method: string) => {
    return method === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản ngân hàng"
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: "Chờ xác nhận", color: "bg-yellow-500" },
      confirmed: { text: "Đã xác nhận", color: "bg-blue-500" },
      processing: { text: "Đang xử lý", color: "bg-purple-500" },
      shipping: { text: "Đang giao hàng", color: "bg-orange-500" },
      delivered: { text: "Đã giao hàng", color: "bg-green-500" },
      cancelled: { text: "Đã hủy", color: "bg-red-500" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={`${config.color} hover:${config.color}`}>{config.text}</Badge>
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-600">Cảm ơn bạn đã mua sắm tại BookStore</p>
      </div>

      {/* Order Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Thông tin đơn hàng</span>
            </span>
            {getStatusBadge(order.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Mã đơn hàng:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-blue-600">{order.orderNumber}</span>
                  <Button variant="ghost" size="sm" onClick={copyOrderNumber} className="p-1 h-auto">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ngày đặt:</span>
                <span>{order.createdAt.toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phương thức thanh toán:</span>
                <span>{getPaymentMethodText(order.paymentMethod)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Tổng tiền:</span>
                <span className="text-lg font-bold text-red-600">{order.total.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Trạng thái:</span>
                {getStatusBadge(order.status)}
              </div>
            </div>
          </div>

          {order.paymentMethod === "bank_transfer" && order.status === "pending" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Thông tin chuyển khoản:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Ngân hàng:</strong> Vietcombank
                </p>
                <p>
                  <strong>Số tài khoản:</strong> 1234567890
                </p>
                <p>
                  <strong>Chủ tài khoản:</strong> BOOKSTORE VIETNAM
                </p>
                <p>
                  <strong>Số tiền:</strong> {order.total.toLocaleString("vi-VN")}đ
                </p>
                <p>
                  <strong>Nội dung:</strong> {order.orderNumber} - {order.shippingAddress.fullName}
                </p>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                * Vui lòng chuyển khoản trong vòng 24h để đơn hàng được xử lý
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5" />
            <span>Địa chỉ giao hàng</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-gray-600">{order.shippingAddress.email}</p>
            <p className="text-gray-600">
              {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district},{" "}
              {order.shippingAddress.city}
            </p>
            {order.shippingAddress.notes && (
              <p className="text-sm text-gray-500 italic">Ghi chú: {order.shippingAddress.notes}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sản phẩm đã đặt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.author}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tạm tính</span>
              <span>{order.subtotal.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee === 0 ? "Miễn phí" : `${order.shippingFee.toLocaleString("vi-VN")}đ`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Thuế VAT</span>
              <span>{order.tax.toLocaleString("vi-VN")}đ</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <span className="text-red-600">{order.total.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </Button>
        <Button asChild>
          <Link href="/order-tracking">
            <Package className="w-4 h-4 mr-2" />
            Theo dõi đơn hàng
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Thông tin quan trọng:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Đơn hàng sẽ được xử lý trong vòng 1-2 ngày làm việc</li>
          <li>• Thời gian giao hàng: 2-5 ngày làm việc tùy theo khu vực</li>
          <li>• Bạn có thể theo dõi trạng thái đơn hàng bằng mã đơn hàng</li>
          <li>• Liên hệ hotline: (028) 1234 5678 nếu cần hỗ trợ</li>
        </ul>
      </div>
    </div>
  )
}
