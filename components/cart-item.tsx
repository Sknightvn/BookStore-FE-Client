"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Minus, Plus } from "lucide-react"
import Image from "next/image"
import { useCart, type CartItem } from "@/contexts/cart-context"
import { message } from "antd"

interface CartItemComponentProps {
  item: CartItem
}

export default function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateQuantity, removeFromCart } = useCart()

  // Handle quantity change from the input field
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove()
      return
    }
    updateQuantity(item.product.id, newQuantity)
  }

  const handleRemove = () => {
    removeFromCart(item.product.id)
    message.success("Đã xóa sản phẩm khỏi giỏ hàng!")
  }

  // Handle input change for quantity
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value)) {
      handleQuantityChange(value)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-20 h-28 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          {item.product.coverImage ? (
            <Image
              src={item.product.coverImage || "/placeholder.svg"}
              alt={item.product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Không có ảnh</div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.product.title}</h3>
          <p className="text-sm text-gray-600">Tập: {item.product.volume || "Không có"}</p>
          <p className="text-blue-600 font-bold mb-3">{item.product.price.toLocaleString("vi-VN")}₫</p>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-2"
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            {/* Input for quantity */}
            <input
              type="number"
              value={item.quantity}
              onChange={handleInputChange}
              min="1"
              className="w-12 text-center font-medium border rounded-md p-1"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Total & Remove */}
        <div className="flex flex-col items-end justify-between">
          <p className="font-bold text-gray-900">{(item.product.price * item.quantity).toLocaleString("vi-VN")}₫</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
