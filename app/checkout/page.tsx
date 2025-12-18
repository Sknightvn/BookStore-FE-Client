"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconArrowLeft, IconCreditCard, IconTruck, IconMapPin, IconUserSquareRounded, IconPhone, IconMail, IconShoppingCart } from "@tabler/icons-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import type { ShippingAddress } from "@/lib/orders-data"
import { message } from "antd"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, getShippingFee, getTax, getFinalTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    ward: "",
    district: "",
    city: "",
    notes: "",
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }

    const savedAddress = localStorage.getItem("selectedDeliveryAddress")
    if (savedAddress) {
      const addr = JSON.parse(savedAddress)
      setShippingAddress((prev) => ({
        ...prev,
        address: addr.street,
        ward: addr.ward,
        district: addr.district,
        city: addr.city,
      }))
    }
  }, [items, router])

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const requiredFields = ["fullName", "phone", "email", "address", "ward", "district", "city"]
    const missingFields = requiredFields.filter((field) => !shippingAddress[field as keyof ShippingAddress])

    if (missingFields.length > 0) {
      message.error("Vui lòng điền đầy đủ thông tin giao hàng!")
      return false
    }

    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(shippingAddress.phone)) {
      message.error("Số điện thoại không hợp lệ!")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingAddress.email)) {
      message.error("Email không hợp lệ!")
      return false
    }

    return true
  }

  const handleProceedToPayment = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const checkoutData = {
        items,
        shippingAddress,
        subtotal: getTotalPrice(),
        shippingFee: getShippingFee(),
        tax: getTax(),
        total: getFinalTotal(),
        paymentMethod,

      }

      localStorage.setItem("checkoutData", JSON.stringify(checkoutData))
      message.success("Thông tin đã được lưu!")
      router.push("/payment")
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
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
              <BreadcrumbPage>Thanh toán</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="flex items-center space-x-2">
                <IconMapPin size={20} className="text-indigo-700" />
                <span className="text-lg text-indigo-700">Thông tin giao hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <div className="relative">
                    <IconUserSquareRounded size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <div className="relative">
                    <IconPhone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <IconMail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Nhập email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ cụ thể *</Label>
                <Input
                  id="address"
                  value={shippingAddress.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Số nhà, tên đường"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã *</Label>
                  <Input
                    id="ward"
                    value={shippingAddress.ward}
                    onChange={(e) => handleInputChange("ward", e.target.value)}
                    placeholder="Phường/Xã"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Quận/Huyện *</Label>
                  <Input
                    id="district"
                    value={shippingAddress.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    placeholder="Quận/Huyện"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Tỉnh/Thành phố"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  value={shippingAddress.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Ghi chú cho đơn hàng (ví dụ: giao hàng giờ hành chính)"
                  rows={3}
                />
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
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as "cod" | "bank_transfer")}
              >
                <div className="space-y-3">
                  <div
                    className={`relative flex items-start space-x-4 p-5 rounded-lg border transition-all duration-200 cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-green-500 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100"
                        : "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50/30"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <RadioGroupItem value="cod" id="cod" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="cod" className="cursor-pointer w-full">
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
                            paymentMethod === "cod" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            <IconTruck size={22} />
                          </div>
                          <div className="flex-1 pt-0.5">
                            <div className={`font-bold text-lg mb-1 ${
                              paymentMethod === "cod" ? "text-green-700" : "text-gray-900"
                            }`}>
                              Thanh toán khi nhận hàng (COD)
                            </div>
                            <div className={`text-sm ${
                              paymentMethod === "cod" ? "text-green-600" : "text-gray-500"
                            }`}>
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div
                    className={`relative flex items-start space-x-4 p-5 rounded-lg border transition-all duration-200 cursor-pointer ${
                      paymentMethod === "bank_transfer"
                        ? "border-purple-500 bg-gradient-to-br from-purple-100 via-violet-100 to-fuchsia-100"
                        : "border-gray-200 bg-white hover:border-purple-400 hover:bg-purple-50/30"
                    }`}
                    onClick={() => setPaymentMethod("bank_transfer")}
                  >
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="bank_transfer" className="cursor-pointer w-full">
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
                            paymentMethod === "bank_transfer" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            <IconCreditCard size={22} />
                          </div>
                          <div className="flex-1 pt-0.5">
                            <div className={`font-bold text-lg mb-1 ${
                              paymentMethod === "bank_transfer" ? "text-purple-700" : "text-gray-900"
                            }`}>
                              Chuyển khoản ngân hàng
                            </div>
                            <div className={`text-sm ${
                              paymentMethod === "bank_transfer" ? "text-purple-600" : "text-gray-500"
                            }`}>
                              Chuyển khoản trước khi giao hàng
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="flex items-center space-x-2">
                <IconShoppingCart size={20} />
                <span className="text-lg text-indigo-700">Tóm tắt đơn hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.coverImage || "/placeholder.svg"}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.title}</p>
                      <p className="text-sm text-indigo-950">
                        {item.quantity} × {item.product.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>{getShippingFee() === 0 ? "Miễn phí" : `${getShippingFee().toLocaleString("vi-VN")}đ`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế VAT (10%)</span>
                  <span>{getTax().toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-red-600">{getFinalTotal().toLocaleString("vi-VN")}đ</span>
              </div>

              {/* Proceed to Payment Button */}
              <Button
                onClick={handleProceedToPayment}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
                size="lg"
              >
                {isLoading ? "Đang xử lý..." : "Tiến hành thanh toán"}
              </Button>

              <p className="text-sm text-indigo-950 text-center">
                Bằng cách đặt hàng, bạn đồng ý với{" "}
                <a href="/terms" className="text-indigo-600 hover:underline">
                  điều khoản sử dụng
                </a>{" "}
                của chúng tôi
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
