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
import { ArrowLeft, CreditCard, Truck, MapPin, User, Phone, Mail } from "lucide-react"
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
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Thông tin giao hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Phương thức thanh toán</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as "cod" | "bank_transfer")}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RadioGroupItem value="cod" id="cod" />
                    <div className="flex-1">
                      <Label htmlFor="cod" className="flex items-center space-x-3 cursor-pointer">
                        <Truck className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <div className="flex-1">
                      <Label htmlFor="bank_transfer" className="flex items-center space-x-3 cursor-pointer">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-gray-500">Chuyển khoản trước khi giao hàng</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {/* {paymentMethod === "bank_transfer" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                      <strong>Nội dung:</strong> [Mã đơn hàng] - [Họ tên]
                    </p>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    * Đơn hàng sẽ được xử lý sau khi chúng tôi xác nhận thanh toán
                  </p>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
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
                      <p className="text-sm text-gray-600">
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
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                size="lg"
              >
                {isLoading ? "Đang xử lý..." : "Tiến hành thanh toán"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Bằng cách đặt hàng, bạn đồng ý với{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
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
