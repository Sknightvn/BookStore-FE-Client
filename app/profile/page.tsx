"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconUserSquareRounded, IconPackage, IconClock, IconCircleCheck, IconRefresh, IconAward, IconEye, IconLock, IconX, IconChartLine } from "@tabler/icons-react"
import { useAuth } from "@/contexts/auth-context"
import { message, Modal } from "antd"
import { getSocket, joinOrderRoom, leaveOrderRoom } from "@/lib/socket"
import { useUserOrders, useCancelOrder } from "@/hooks/useOrders"
import { useUpdatePassword } from "@/hooks/useAuth"
import type { Order } from "@/interface/response/order"

function ProfilePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { data: ordersData, isLoading } = useUserOrders(user?.id || "")
  const orders = ordersData?.orders || []

  const activeTab = searchParams.get("tab") || "profile"

  const cancelOrderMutation = useCancelOrder()
  const updatePasswordMutation = useUpdatePassword()

  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
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
      <Badge className={`${config.color} hover:${config.color} flex items-center space-x-1 whitespace-nowrap`}>
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

  // Reset to page 1 when orders change - MUST be before early returns
  useEffect(() => {
    setCurrentPage(1)
  }, [orders.length])

  if (!isAuthenticated || !user) return null

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-4 animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-indigo-200 rounded w-20"></div>
            <div className="h-4 w-4 bg-indigo-200 rounded"></div>
            <div className="h-4 bg-indigo-200 rounded w-32"></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 animate-pulse">
            <div className="h-12 bg-indigo-100 rounded-t-2xl"></div>
            <div className="h-12 bg-indigo-100 rounded-t-2xl"></div>
            <div className="h-12 bg-indigo-100 rounded-t-2xl"></div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-indigo-500 p-4 rounded-b-2xl space-y-4">
            {/* Card Skeleton */}
            <div className="border border-indigo-300 bg-slate-50/80 rounded-lg overflow-hidden">
              <div className="bg-indigo-100 h-14"></div>
              <div className="bg-white p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-indigo-200 rounded w-24"></div>
                    <div className="h-5 bg-indigo-200 rounded w-40"></div>
                    <div className="h-4 bg-indigo-200 rounded w-20"></div>
                    <div className="h-5 bg-indigo-200 rounded w-48"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-indigo-200 rounded w-28"></div>
                    <div className="h-5 bg-indigo-200 rounded w-32"></div>
                    <div className="h-4 bg-indigo-200 rounded w-24"></div>
                    <div className="h-6 bg-indigo-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card Skeleton */}
            <div className="border border-indigo-300 bg-slate-50/80 rounded-lg overflow-hidden">
              <div className="bg-indigo-100 h-14"></div>
              <div className="bg-white p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-300">
                      <div className="h-8 bg-indigo-200 rounded w-12 mx-auto mb-2"></div>
                      <div className="h-4 bg-indigo-200 rounded w-20 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = getOrderStats()

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOrders = orders.slice(startIndex, endIndex)

  // Generate pagination items
  const getPaginationItems = () => {
    const items: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total pages <= maxVisible
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      // Always show first page
      items.push(1)

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          items.push(i)
        }
        items.push("...")
        items.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        items.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        // In the middle
        items.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i)
        }
        items.push("...")
        items.push(totalPages)
      }
    }

    return items
  }

  const paginationItems = getPaginationItems()

  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case "orders":
        return "Lịch sử đơn hàng"
      case "security":
        return "Bảo mật"
      default:
        return "Thông tin cá nhân"
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile">Thông tin cá nhân</BreadcrumbLink>
            </BreadcrumbItem>
            {activeTab !== "profile" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbLabel()}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Tabs defaultValue={activeTab} value={activeTab} className="space-y-4" onValueChange={(value) => {
        router.push(`/profile${value !== "profile" ? `?tab=${value}` : ""}`)
      }}>
        <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2 !p-0">
          <TabsTrigger value="profile" className="[&[data-state=active]]:bg-indigo-500 py-4 rounded-t-2xl rounded-b-none [&[data-state=active]]:text-white text-base [&[data-state=inactive]]:bg-indigo-50 [&[data-state=inactive]]:text-indigo-950">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="security" className="[&[data-state=active]]:bg-indigo-500 py-4 rounded-t-2xl rounded-b-none [&[data-state=active]]:text-white text-base [&[data-state=inactive]]:bg-indigo-50 [&[data-state=inactive]]:text-indigo-950">Bảo mật</TabsTrigger>
          <TabsTrigger value="orders" className="[&[data-state=active]]:bg-indigo-500 py-4 rounded-t-2xl rounded-b-none [&[data-state=active]]:text-white text-base [&[data-state=inactive]]:bg-indigo-50 [&[data-state=inactive]]:text-indigo-950">Lịch sử đơn hàng</TabsTrigger>
        </TabsList>

        {/* Tab Profile */}
        <TabsContent value="profile" className="space-y-4 bg-indigo-500 p-4 overflow-hidden -translate-y-2 rounded-b-2xl">
          <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="flex items-center space-x-2">
                <IconUserSquareRounded size={20} className="text-indigo-700" />
                <span className="text-lg text-indigo-700">Thông tin tài khoản</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-indigo-950 underline">Họ và tên:</label>
                    <p className="text-base font-medium text-indigo-950">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-indigo-950 underline">Email:</label>
                    <p className="text-base font-medium text-indigo-950">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-indigo-950 underline">Ngày tham gia:</label>
                    <p className="text-base font-medium text-indigo-950">{new Date().toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div className="space-x-2">
                    <label className="text-sm font-medium text-indigo-950 underline">Trạng thái:</label>
                    <Badge className="bg-green-500 hover:bg-green-600">Đã xác thực</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Stats */}
          <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="flex items-center space-x-2">
                <IconChartLine size={20} className="text-indigo-700" />
                <span className="text-lg text-indigo-700">Thống kê đơn hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-300">
                  <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                  <div className="text-sm text-indigo-600">Tổng đơn hàng</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-300">
                  <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                  <div className="text-sm text-green-600">Hoàn thành</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-300">
                  <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                  <div className="text-sm text-orange-600">Đang xử lý</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-300">
                  <div className="text-2xl font-bold text-purple-600">{stats.paid}</div>
                  <div className="text-sm text-purple-600">Đã hoàn trả</div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-300">
                  <div className="text-2xl font-bold text-pink-600">{stats.totalItems}</div>
                  <div className="text-sm text-pink-600">Tổng số sản phẩm đã mua</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Security */}
        <TabsContent value="security" className="space-y-4 bg-indigo-500 p-4 overflow-hidden -translate-y-2 rounded-b-2xl">
          <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="flex items-center space-x-2">
                <IconLock size={20} className="text-indigo-700" />
                <span className="text-lg text-indigo-700">Đổi mật khẩu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
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
                <Button type="submit" disabled={isChangingPassword} className="w-full bg-indigo-600 h">
                  {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Orders */}
        <TabsContent value="orders" className="space-y-4 bg-indigo-500 p-4 overflow-hidden -translate-y-2 rounded-b-2xl">
          <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="flex items-center space-x-2">
                <IconPackage size={20} className="text-indigo-700" />
                <span className="text-lg text-indigo-700">Lịch sử đơn hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-0">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <IconPackage size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-indigo-950">Bạn chưa có đơn hàng nào</p>
                  <Button onClick={() => router.push("/products")} className="mt-4">
                    Mua sắm ngay
                  </Button>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader className="bg-indigo-50">
                      <TableRow>
                        <TableHead className="w-[120px]">Mã đơn hàng</TableHead>
                        <TableHead className="w-[140px]">Sản phẩm</TableHead>
                        <TableHead className="w-[60px]">Số lượng</TableHead>
                        <TableHead className="w-[100px]">Tổng tiền</TableHead>
                        <TableHead className="w-[140px]">Trạng thái</TableHead>
                        <TableHead className="w-[100px]">Ngày đặt</TableHead>
                        <TableHead className="w-[80px]">Thanh toán</TableHead>
                        <TableHead className="w-[120px]">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrders.map((order) => {
                        const totalQuantity = order.items.reduce((sum, i) => sum + i.quantity, 0)
                        return (
                          <TableRow key={order._id} className="hover:bg-indigo-50/50">
                            <TableCell>
                              <span className="font-mono text-sm text-indigo-600 font-semibold">
                                {order.orderCode}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
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
                                    <div className="w-10 h-10 bg-gray-200 rounded border-2 border-white flex items-center justify-center text-xs font-medium text-indigo-950">
                                      +{order.items.length - 3}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-indigo-950 line-clamp-1">
                                    {order.items[0]?.title || "N/A"}
                                  </p>
                                  {order.items.length > 1 && (
                                    <p className="text-xs text-indigo-600">
                                      và {order.items.length - 1} sản phẩm khác
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-indigo-950 font-medium">{totalQuantity}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-bold text-red-500">
                                {order.total.toLocaleString("vi-VN")}đ
                              </span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-indigo-950">
                                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-indigo-950">
                                {order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 flex-wrap">
                                {order.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleCancelOrder(order._id)}
                                    disabled={cancelingOrderId === order._id}
                                    className="text-xs w-full"
                                  >
                                    {cancelingOrderId === order._id ? "Đang hủy..." : "Hủy"}
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/order-tracking?orderNumber=${order.orderCode}`)}
                                  className="text-xs w-full"
                                >
                                  <IconEye size={14} className="mr-1" />
                                  Chi tiết
                                </Button>
                                {order.status === "delivered" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/return-request?orderNumber=${order.orderCode}`)}
                                    className="text-xs w-full"
                                  >
                                    Trả hàng
                                  </Button>
                                )}
                                {order.status === "completed" && (
                                  <Button size="sm" className="text-xs w-full">
                                    Mua lại
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t border-indigo-200">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          {paginationItems.map((item, index) => {
                            if (item === "...") {
                              return (
                                <PaginationItem key={`ellipsis-${index}`}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )
                            }
                            return (
                              <PaginationItem key={item}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(item as number)}
                                  isActive={currentPage === item}
                                  className="cursor-pointer"
                                >
                                  {item}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  )
}
