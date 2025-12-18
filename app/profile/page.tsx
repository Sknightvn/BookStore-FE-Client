"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconUserSquareRounded, IconPackage, IconClock, IconCircleCheck, IconRefresh, IconAward, IconEye, IconLock, IconX } from "@tabler/icons-react"
import { useAuth } from "@/contexts/auth-context"
import { message, Modal } from "antd"
import { getSocket, joinOrderRoom, leaveOrderRoom } from "@/lib/socket"
import { useUserOrders, useCancelOrder } from "@/hooks/useOrders"
import { useUpdatePassword } from "@/hooks/useAuth"
import type { Order } from "@/interface/response/order"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { data: ordersData, isLoading } = useUserOrders(user?.id || "")
  const orders = ordersData?.orders || []

  const cancelOrderMutation = useCancelOrder()
  const updatePasswordMutation = useUpdatePassword()

  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { confirm } = Modal

  useEffect(() => {
    if (!isAuthenticated) {
      message.error("Vui lòng đăng nhập để xem thông tin cá nhân!")
      router.push("/login")
      return
    }
  }, [isAuthenticated, router])

  // Socket.io realtime updates - React Query will handle refetching automatically
  useEffect(() => {
    if (!user?.id || orders.length === 0) return

    const socket = getSocket()

    // Join room cho tất cả các đơn hàng của user
    orders.forEach((order: Order) => {
      joinOrderRoom(order._id)
    })

    const handleOrderUpdate = (data: any) => {
      message.info(`Đơn hàng ${data.orderCode} đã được cập nhật!`)
    }

    socket.on("order-status-updated", handleOrderUpdate)

    // Cleanup khi unmount
    return () => {
      socket.off("order-status-updated", handleOrderUpdate)
      orders.forEach((order: Order) => {
        leaveOrderRoom(order._id)
      })
    }
  }, [user?.id, orders.length])

  const getTotalPurchasedItems = () => {
    return orders.reduce((total, order) => {
      const orderQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
      return total + orderQuantity
    }, 0)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: "Chờ xác nhận", color: "bg-yellow-500", icon: IconClock },
      pending_payment: { text: "Chờ thanh toán", color: "bg-yellow-600", icon: IconClock },
      confirmed: { text: "Đã xác nhận", color: "bg-indigo-500", icon: IconCircleCheck },
      processing: { text: "Đang xử lý", color: "bg-purple-500", icon: IconPackage },
      shipping: { text: "Đang giao hàng", color: "bg-orange-500", icon: IconPackage },
      delivered: { text: "Đã giao hàng", color: "bg-green-500", icon: IconCircleCheck },
      completed: { text: "Hoàn thành", color: "bg-green-600", icon: IconAward },
      refunded: { text: "Đã hoàn trả", color: "bg-indigo-600", icon: IconRefresh },
      cancelled: { text: "Đã hủy", color: "bg-red-500", icon: IconClock },
      yeu_cau_hoan_tra: { text: "Đã gửi yêu cầu trả hàng", color: "bg-red-500", icon: IconClock },
      paid: { text: "Hoàn hàng", color: "bg-yellow-500", icon: IconClock },
      tuchoi: { text: "Đơn hàng bị huỷ", color: "bg-red-500", icon: IconX },
      huydonhang: { text: "Đã huỷ đơn", color: "bg-yellow-400", icon: IconRefresh },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const IconComponent = config.icon
    return (
      <Badge className={`${config.color} hover:${config.color} flex items-center space-x-1`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.text}</span>
      </Badge>
    )
  }

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      pending: orders.filter((o) => ["pending", "confirmed", "processing", "shipping"].includes(o.status)).length,
      paid: orders.filter((o) => o.status === "paid").length,
      tuchoi: orders.filter((o) => o.status === "tuchoi").length,
      totalItems: getTotalPurchasedItems(),
    }
    return stats
  }
  //huỷ đơn
  const handleCancelOrder = async (orderId: string) => {
    if (!user?.id) {
      message.error("Không tìm thấy thông tin người dùng!")
      return
    }

    confirm({
      title: "Xác nhận hủy đơn hàng",
      content: "Bạn có chắc muốn hủy đơn hàng này không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        setCancelingOrderId(orderId)
        cancelOrderMutation.mutate(
          {
            orderId,
            data: {
              userId: user.id,
              userName: user.name,
            },
          },
          {
            onSuccess: () => {
              message.success("Hủy đơn hàng thành công!")
              setCancelingOrderId(null)
            },
            onError: (error: any) => {
              console.error("Lỗi khi hủy đơn hàng:", error)
              message.error(error.response?.data?.message || "Hủy đơn hàng thất bại!")
              setCancelingOrderId(null)
            },
          }
        )
      },
    })
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      message.error("Vui lòng điền đầy đủ các trường!")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      message.error("Mật khẩu mới không khớp!")
      return
    }

    if (passwordData.newPassword.length < 6) {
      message.error("Mật khẩu mới phải có ít nhất 6 ký tự!")
      return
    }

    if (!user?.id) return

    setIsChangingPassword(true)
    updatePasswordMutation.mutate(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        userId: user.id,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            message.success("Đổi mật khẩu thành công!")
            setPasswordData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            })
          } else {
            message.error(data.message || "Đổi mật khẩu thất bại!")
          }
          setIsChangingPassword(false)
        },
        onError: (error: any) => {
          console.error("Lỗi khi đổi mật khẩu:", error)
          message.error(error.response?.data?.message || "Đổi mật khẩu thất bại!")
          setIsChangingPassword(false)
        },
      }
    )
  }

  if (!isAuthenticated || !user) return null

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const stats = getOrderStats()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
        <p className="text-indigo-950">Quản lý thông tin và đơn hàng của bạn</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="orders">Lịch sử đơn hàng</TabsTrigger>
        </TabsList>

        {/* Tab Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconUserSquareRounded size={20} />
                <span>Thông tin tài khoản</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                    <p className="text-lg font-medium text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày tham gia</label>
                    <p className="text-lg font-medium text-gray-900">{new Date().toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                    <Badge className="bg-green-500 hover:bg-green-600">Đã xác thực</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                  <div className="text-sm text-indigo-600">Tổng đơn hàng</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                  <div className="text-sm text-green-600">Hoàn thành</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                  <div className="text-sm text-orange-600">Đang xử lý</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.paid}</div>
                  <div className="text-sm text-purple-600">Đã hoàn trả</div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">{stats.totalItems}</div>
                  <div className="text-sm text-pink-600">Tổng số sản phẩm đã mua</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconLock size={20} />
                <span>Đổi mật khẩu</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-950">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-950">Mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-950">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <Button type="submit" disabled={isChangingPassword} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Orders */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconPackage size={20} />
                <span>Lịch sử đơn hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <IconPackage size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-indigo-950">Bạn chưa có đơn hàng nào</p>
                  <Button onClick={() => router.push("/products")} className="mt-4">
                    Mua sắm ngay
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm text-indigo-600">{order.orderCode}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">{order.total.toLocaleString("vi-VN")}đ</div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex -space-x-2">
                          {(order.items || []).slice(0, 3).map((item, index) => (
                            <img
                              key={index}
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-10 h-10 object-cover rounded border-2 border-white"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-10 h-10 bg-gray-200 rounded border-2 border-white flex items-center justify-center text-sm font-medium">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-indigo-950">
                            {order.items.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm •{" "}
                            {order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        {order.status === "pending" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancelingOrderId === order._id}
                          >
                            {cancelingOrderId === order._id ? "Đang hủy..." : "Hủy đơn hàng"}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/order-tracking?orderNumber=${order.orderCode}`)}
                        >
                          <IconEye size={16} className="mr-1" />
                          Xem chi tiết
                        </Button>
                        {order.status === "delivered" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/return-request?orderNumber=${order.orderCode}`)}
                          >
                            Trả hàng
                          </Button>
                        )}
                        {order.status === "completed" && <Button size="sm">Mua lại</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
