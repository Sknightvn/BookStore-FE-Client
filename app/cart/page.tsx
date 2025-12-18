"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  IconShoppingCart,
  IconArrowLeft,
  IconTruck,
  IconCreditCard,
  IconMapPin,
  IconPlus,
  IconTrash,
  IconCheck,
  IconX,
  IconShoppingCartPlus,
} from "@tabler/icons-react"
import { useCart } from "@/contexts/cart-context"
import CartItemComponent from "@/components/cart-item"
import PromotionSelector from "@/components/promotion-selector"
import { message } from "antd"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useBooks } from "@/hooks/useBooks"
import { useCustomerByUserId } from "@/hooks/useCustomers"
import { useCustomerAddresses, useAddAddress, useDeleteAddress } from "@/hooks/useAddresses"
import Image from "next/image"

export default function CartPage() {
  const { user } = useAuth()
  const router = useRouter()

  // React Query hooks
  const { data: booksData } = useBooks()
  const { data: customerData } = useCustomerByUserId(user?.id || "")
  const customerId = customerData?.data?._id || ""
  const { data: addressesData } = useCustomerAddresses(customerId)
  const addAddressMutation = useAddAddress()
  const deleteAddressMutation = useDeleteAddress()

  const {
    items,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getShippingFee,
    getTax,
    getFinalTotal,
    getDiscountAmount,
    deliveryAddresses,
    selectedAddressId,
    selectAddress,
    deleteAddress,
    setDeliveryAddresses,
    getSelectedAddress,
  } = useCart()

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [isCheckingStock, setIsCheckingStock] = useState(false)
  const [address, setAddress] = useState({
    street: "",
    ward: "",
    district: "",
    city: "",
  })

  useEffect(() => {
    if (addressesData?.success && addressesData.addresses) {
      const formattedAddresses = addressesData.addresses.map((addr: any) => ({
        id: addr.id || addr._id,
        street: addr.street,
        ward: addr.ward,
        district: addr.district,
        city: addr.city,
      }))
      setDeliveryAddresses(formattedAddresses)
      if (formattedAddresses.length > 0 && !selectedAddressId) {
        selectAddress(formattedAddresses[0].id)
      }
    }
  }, [addressesData, setDeliveryAddresses, selectedAddressId, selectAddress])

  const checkStockAvailability = async (cartItems: any[]) => {
    try {
      const books = booksData?.data || []
      const stockIssues: { title: string; requested: number; available: number }[] = []

      cartItems.forEach((item) => {
        const book = books.find((b: any) => b._id === item.product.id)

        if (!book) {
          stockIssues.push({
            title: item.product.title || "Sản phẩm không xác định",
            requested: item.quantity,
            available: 0,
          })
        } else if (book.stock < item.quantity) {
          stockIssues.push({
            title: book.title,
            requested: item.quantity,
            available: book.stock || 0,
          })
        }
      })

      return { success: true, stockIssues }
    } catch (error) {
      console.error("❌ Lỗi kiểm tra stock:", error)
      return {
        success: false,
        error: "Không thể kiểm tra stock: " + (error instanceof Error ? error.message : "Lỗi không xác định"),
      }
    }
  }

  const handleClearCart = () => {
    clearCart()
    message.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng!")
  }

  const handleSaveAddress = async () => {
    if (!address.street || !address.ward || !address.district || !address.city) {
      message.error("Vui lòng điền đầy đủ thông tin địa chỉ!")
      return
    }

    if (!customerId) {
      message.error("Không tìm thấy khách hàng!")
      return
    }

    addAddressMutation.mutate(
      {
        customerId,
        street: address.street,
        ward: address.ward,
        district: address.district,
        city: address.city,
      },
      {
        onSuccess: () => {
          message.success("Đã lưu địa chỉ giao hàng!")
          setAddress({ street: "", ward: "", district: "", city: "" })
          setShowAddressForm(false)
        },
        onError: (error: any) => {
          console.error("❌ Lỗi khi lưu địa chỉ:", error)
          message.error("Không thể lưu địa chỉ")
        },
      }
    )
  }

  const handleSelectAddress = (addressId: string) => {
    selectAddress(addressId)
    message.success("Đã chọn địa chỉ giao hàng!")
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!customerId) return

    const index = deliveryAddresses.findIndex((addr) => addr.id === addressId)
    if (index === -1) return

    deleteAddressMutation.mutate(
      {
        customerId,
        index,
      },
      {
        onSuccess: () => {
          message.success("Đã xóa địa chỉ!")
        },
        onError: (error: any) => {
          console.error("❌ Lỗi khi xóa địa chỉ:", error)
          message.error("Không thể xóa địa chỉ")
        },
      }
    )
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      message.error("Giỏ hàng của bạn đang trống!")
      return
    }
    if (deliveryAddresses.length === 0 || !selectedAddressId) {
      message.error("Vui lòng chọn địa chỉ giao hàng!")
      return
    }

    setIsCheckingStock(true)
    try {
      const stockCheck = await checkStockAvailability(items)

      if (!stockCheck.success) {
        message.error(stockCheck.error || "Không thể kiểm tra stock")
        setIsCheckingStock(false)
        return
      }

      if (stockCheck.stockIssues && Array.isArray(stockCheck.stockIssues) && stockCheck.stockIssues.length > 0) {
        const issuesText = stockCheck.stockIssues
          .map((issue) => `${issue.title}: yêu cầu ${issue.requested}, còn ${issue.available}`)
          .join("\n")
        message.error(`Không đủ sản phẩm:\n${issuesText}`)
        setIsCheckingStock(false)
        return
      }

      message.success("✓ Kiểm tra thành công. Tiến hành thanh toán...")

      const selectedAddr = getSelectedAddress()
      if (selectedAddr) {
        localStorage.setItem(
          "selectedDeliveryAddress",
          JSON.stringify({
            street: selectedAddr.street,
            ward: selectedAddr.ward,
            district: selectedAddr.district,
            city: selectedAddr.city,
          }),
        )
      }
      router.push("/checkout")
    } catch (error) {
      console.error("❌ Lỗi kiểm tra stock:", error)
      message.error("Lỗi khi kiểm tra stock")
    } finally {
      setIsCheckingStock(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Giỏ hàng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="text-center py-12">
          <IconShoppingCart size={96} className="text-gray-300 mx-auto mb-6" />
          <Image
            src="/empty-cart.png"
            alt="Giỏ hàng trống"
            width={200}
            height={200}
            className="mx-auto mb-4 h-20 w-20"
          />
          <Button asChild size="lg" variant="fulled">
            <Link href="/products">
              Tiếp tục mua sắm
              <IconShoppingCartPlus size={16} className="mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb + Header */}
      <div className="mb-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Giỏ hàng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden mb-4">
      <CardHeader className="bg-indigo-100">
          <div className="flex items-center justify-between text-lg">
            <CardTitle className="flex items-center space-x-2">
              <IconMapPin size={16} />
              <span className="text-lg">Địa chỉ nhận hàng</span>
            </CardTitle>
            {!showAddressForm && (
              <Button variant="fulled" size="sm" onClick={() => setShowAddressForm(true)}>
                <IconPlus size={16} className="mr-2" />
                Thêm địa chỉ
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showAddressForm && (
            <div className="mb-6 p-4 border-2 border-indigo-200 rounded-lg bg-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Thêm địa chỉ mới</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddressForm(false)
                    setAddress({ street: "", ward: "", district: "", city: "" })
                  }}
                >
                  <IconX size={16} />
                </Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="street" className="text-sm font-medium">
                    Số nhà, tên đường
                  </Label>
                  <Input
                    id="street"
                    placeholder="VD: 108 Nguyễn Thường Hiền"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ward" className="text-sm font-medium">
                      Phường/Xã
                    </Label>
                    <Input
                      id="ward"
                      placeholder="VD: Phường 1"
                      value={address.ward}
                      onChange={(e) => setAddress({ ...address, ward: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district" className="text-sm font-medium">
                      Quận/Huyện
                    </Label>
                    <Input
                      id="district"
                      placeholder="VD: Gò Vấp"
                      value={address.district}
                      onChange={(e) => setAddress({ ...address, district: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">
                    Tỉnh/Thành phố
                  </Label>
                  <Input
                    id="city"
                    placeholder="VD: Hồ Chí Minh"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddressForm(false)
                      setAddress({ street: "", ward: "", district: "", city: "" })
                    }}
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleSaveAddress} className="bg-indigo-600 hover:bg-indigo-700">
                    Lưu địa chỉ
                  </Button>
                </div>
              </div>
            </div>
          )}

          {deliveryAddresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <IconMapPin size={48} className="mx-auto mb-3 text-gray-300" />
              <p>Chưa có địa chỉ nào. Nhấn "Thêm địa chỉ" để thêm địa chỉ giao hàng.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliveryAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedAddressId === addr.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => handleSelectAddress(addr.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {selectedAddressId === addr.id && (
                          <div className="flex items-center space-x-1 text-indigo-600 text-sm font-medium">
                            <IconCheck size={16} />
                            <span>Địa chỉ đã chọn</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-indigo-950">
                        {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteAddress(addr.id)
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent key={item.product.id} item={item} />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/products">
                <IconArrowLeft size={16} className="mr-2" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <PromotionSelector />

            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconShoppingCart size={20} />
                  <span>Tóm tắt đơn hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính ({getTotalItems()} sản phẩm)</span>
                    <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
                  </div>

                  {getDiscountAmount() > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Khuyến mãi</span>
                      <span>-{getDiscountAmount().toLocaleString("vi-VN")}đ</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <IconTruck size={16} />
                      <span>Phí vận chuyển</span>
                    </span>
                    <span>{getShippingFee() === 0 ? "Miễn phí" : `${getShippingFee().toLocaleString("vi-VN")}đ`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thuế VAT (10%)</span>
                    <span>{getTax().toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{getFinalTotal().toLocaleString("vi-VN")}đ</span>
                </div>

                {/* Shipping Info */}
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-indigo-700">
                    <IconTruck size={16} />
                    <span>
                      {getShippingFee() === 0
                        ? "Miễn phí vận chuyển"
                        : getTotalPrice() >= 200000
                          ? "Gần được miễn phí vận chuyển"
                          : `Mua thêm ${(200000 - getTotalPrice()).toLocaleString("vi-VN")}đ để giảm phí ship`}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  variant="fulled"
                  className="w-full"
                  disabled={isCheckingStock}
                >
                  <IconCreditCard size={20} className="mr-2" />
                  <span className="text-base">{isCheckingStock ? "Đang kiểm tra đơn hàng..." : "Tiến hành thanh toán"}</span>
                </Button>

                {/* Payment Methods */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Chúng tôi chấp nhận</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-5 bg-indigo-600 rounded text-white text-sm flex items-center justify-center">
                      VISA
                    </div>
                    <div className="w-8 h-5 bg-red-600 rounded text-white text-sm flex items-center justify-center">
                      MC
                    </div>
                    <div className="w-8 h-5 bg-green-600 rounded text-white text-sm flex items-center justify-center">
                      ATM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
