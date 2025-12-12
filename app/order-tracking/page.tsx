"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, Clock, XCircle, RotateCcw, Award } from "lucide-react"
import { message } from "antd"
import { useSearchParams } from "next/navigation"
import { useOrderByCode } from "@/hooks/useOrders"
import { useReturnByOrderId } from "@/hooks/useReturns"
import type { Order } from "@/interface/response/order"
import type { ReturnRequest } from "@/interface/response/return"

export default function OrderTrackingPage() {
  const searchParams = useSearchParams()
  const initialOrderNumber = searchParams.get("orderNumber") || ""
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber)
  const [searchCode, setSearchCode] = useState("")

  // Use React Query hook
  const { data: orderData, isLoading: isSearching, refetch } = useOrderByCode(searchCode)
  const order = orderData?.order || null

  // Fetch return data if order exists
  const { data: returnData, refetch: refetchReturn } = useReturnByOrderId(order?._id || "")
  const returnRequest = returnData?.data || null

  // Tìm đơn hàng
  const handleSearch = async (number?: string) => {
    const code = number || orderNumber
    if (!code.trim()) return message.error("Vui lòng nhập mã đơn hàng!")

    setSearchCode(code.trim())
    refetch()
  }

  useEffect(() => {
    if (initialOrderNumber.trim()) {
      setOrderNumber(initialOrderNumber)
      setSearchCode(initialOrderNumber.trim())
    }
  }, [initialOrderNumber])

  useEffect(() => {
    if (orderData && !orderData.success) {
      message.error("Không tìm thấy đơn hàng!")
    } else if (orderData?.success) {
      message.success("Tìm thấy đơn hàng!")
    }
  }, [orderData])



  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { text: string; color: string }> = {
      pending: { text: "Chờ xác nhận", color: "bg-yellow-500" },
      pending_payment: { text: "Chờ thanh toán", color: "bg-yellow-600" },
      confirmed: { text: "Đã xác nhận", color: "bg-blue-500" },
      processing: { text: "Đang xử lý", color: "bg-purple-500" },
      shipping: { text: "Đang giao hàng", color: "bg-orange-500" },
      delivered: { text: "Đã giao hàng", color: "bg-green-500" },
      completed: { text: "Hoàn thành", color: "bg-green-600" },
      refunded: { text: "Đã hoàn trả", color: "bg-blue-600" },
      cancelled: { text: "Đã từ chối trả hàng", color: "bg-red-500" },
      yeu_cau_hoan_tra: { text: "Yêu cầu hoàn trả", color: "bg-red-500" },
      paid: { text: "Hoàn trả", color: "bg-green-500" },
      tuchoi: { text: "Đơn hàng bị huỷ", color: "bg-red-500" },
      huydonhang: { text: "Đã huỷ đơn", color: "bg-yellow-400", },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={`${config.color} hover:${config.color}`}>{config.text}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_payment":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "processing":
        return <Package className="w-5 h-5 text-purple-500" />
      case "shipping":
        return <Truck className="w-5 h-5 text-orange-500" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "completed":
        return <Award className="w-5 h-5 text-green-600" />
      case "refunded":
        return <RotateCcw className="w-5 h-5 text-blue-600" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "yeu_cau_hoan_tra":
        return <XCircle className="w-5 h-5 text-blue-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getTrackingSteps = (currentStatus: string) => {
    const steps = [
      { key: "pending", label: "Chờ xác nhận", description: "Đơn hàng đã được tiếp nhận" },
      { key: "confirmed", label: "Đã xác nhận", description: "Đơn hàng đã được xác nhận" },
      { key: "processing", label: "Đang xử lý", description: "Đang chuẩn bị hàng hóa" },
      { key: "shipping", label: "Đang giao hàng", description: "Đơn hàng đang được vận chuyển" },
      { key: "delivered", label: "Đã giao hàng", description: "Đơn hàng đã được giao thành công" },
      { key: "completed", label: "Hoàn thành", description: "Giao dịch đã hoàn tất" },
    ]
    const statusOrder = ["pending", "confirmed", "processing", "shipping", "delivered", "completed"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  const getReturnTrackingSteps = (returnStatus: string) => {
    const returnSteps = [
      { key: "accepted", label: "Yêu cầu hoàn trả", description: "Yêu cầu hoàn trả đã được chấp nhận" },
      { key: "checking", label: "Kiểm tra hàng", description: "Đang kiểm tra hàng trả về" },
      { key: "completed", label: "Hoàn trả thành công", description: "Tiền sẽ chuyển về tài khoản trong 3-5 ngày" },
    ]
    const statusOrder = ["accepted", "checking", "completed"]
    const currentIndex = statusOrder.indexOf(returnStatus)
    return returnSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Theo dõi đơn hàng</h1>
        <p className="text-gray-600">Nhập mã đơn hàng để kiểm tra trạng thái</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Tra cứu đơn hàng</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="orderNumber" className="sr-only">
                Mã đơn hàng
              </Label>
              <Input
                id="orderNumber"
                placeholder="Nhập mã đơn hàng (ví dụ: ORD-123456ABC)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={() => handleSearch()} disabled={isSearching} className="px-8">
              {isSearching ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      {order && (
        <>
          {/* Order Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Thông tin đơn hàng</span>
                {getStatusBadge(order.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Mã đơn hàng:</span>
                    <span className="font-mono text-blue-600">{order.orderCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày đặt:</span>
                    <span>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "Đang tải..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phương thức thanh toán:</span>
                    <span>{order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Tổng tiền:</span>
                    <span className="text-lg font-bold text-red-600">{order.total?.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Người nhận:</span>
                    <span>{order.shippingAddress?.fullName || "Đang tải..."}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số điện thoại:</span>
                    <span>{order.shippingAddress?.phone || "Đang tải..."}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status Tracking Timeline */}
          {order.status !== "cancelled" && order.status !== "refunded" && !returnRequest && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Trạng thái đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTrackingSteps(order.status).map((step) => (
                    <div key={step.key} className="flex items-center space-x-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${step.completed
                          ? "bg-green-100 text-green-600"
                          : step.active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                          }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step.active ? (
                          getStatusIcon(step.key)
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${step.completed || step.active ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {step.label}
                        </h4>
                        <p className={`text-sm ${step.completed || step.active ? "text-gray-600" : "text-gray-400"}`}>
                          {step.description}
                        </p>
                      </div>
                      {step.completed && (
                        <div className="text-sm text-green-600">
                          {step.key === order.status ? "Hiện tại" : "Hoàn thành"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Return Status Tracking Timeline */}
          {returnRequest && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Trạng thái trả hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getReturnTrackingSteps(returnRequest.status).map((step) => (
                    <div key={step.key} className="flex items-center space-x-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${step.completed
                          ? "bg-green-100 text-green-600"
                          : step.active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                          }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step.active ? (
                          getStatusIcon(step.key)
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${step.completed || step.active ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {step.label}
                        </h4>
                        <p className={`text-sm ${step.completed || step.active ? "text-gray-600" : "text-gray-400"}`}>
                          {step.description}
                        </p>
                      </div>
                      {step.completed && (
                        <div className="text-sm text-green-600">
                          {step.key === returnRequest.status ? "Hiện tại" : "Hoàn thành"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special Status */}
          {order.status === "completed" && (
            <Card className="border-green-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-green-600">
                  <Award className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">Đơn hàng đã hoàn thành</h3>
                    <p className="text-sm text-green-500">
                      Cảm ơn bạn đã mua hàng! Đơn hàng đã được giao thành công và hoàn tất.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {order.status === "refunded" && (
            <Card className="border-blue-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-blue-600">
                  <RotateCcw className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">Đơn hàng đã được hoàn trả</h3>
                    <p className="text-sm text-blue-500">
                      Đơn hàng của bạn đã được hoàn trả thành công. Tiền sẽ được chuyển về tài khoản trong 3-5 ngày làm
                      việc.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {returnRequest && returnRequest.status === "accepted" && (
            <Card className="border-orange-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-orange-600">
                  <RotateCcw className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">Yêu cầu hoàn trả đã được chấp nhận</h3>
                    <p className="text-sm text-orange-500">
                      Yêu cầu hoàn trả của bạn đã được chấp nhận. Vui lòng chờ chúng tôi kiểm tra hàng trả về.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {returnRequest && returnRequest.status === "checking" && (
            <Card className="border-blue-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-blue-600">
                  <Package className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">Đang kiểm tra hàng trả về</h3>
                    <p className="text-sm text-blue-500">
                      Chúng tôi đang kiểm tra hàng trả về. Tiền sẽ được hoàn lại sau khi kiểm tra xong.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {returnRequest && returnRequest.status === "completed" && (
            <Card className="border-green-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">Hoàn trả thành công</h3>
                    <p className="text-sm text-green-500">
                      Đơn hàng của bạn đã được hoàn trả thành công. Tiền sẽ được chuyển về tài khoản trong 3-5 ngày làm việc.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 border-b pb-2">
                  {item.image && (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    {(item as any)?.author && <p className="text-sm text-gray-500">{(item as any).author}</p>}
                    <p className="text-sm text-gray-700">
                      {item.quantity} x {item.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
