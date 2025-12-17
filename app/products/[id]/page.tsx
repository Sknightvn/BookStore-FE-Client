"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowLeft, IconShoppingCart, IconMinus, IconPlus } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"
import { useParams } from "next/navigation"
import { useBook } from "@/hooks/useBooks"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { data: productData, isLoading: loading } = useBook(productId)
  const product = productData?.data || null

  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (!product) return

    if (quantity > product.stock) {
      return message.error("Số lượng vượt quá hàng tồn kho!")
    }

    addToCart(
      {
        id: product._id,
        title: product.title,
        price: product.price,
        coverImage: product.coverImage,
        volume: product.volume || ""
      },
      quantity
    )

    message.success(`Đã thêm ${quantity} cuốn "${product.title}" vào giỏ hàng!`)
    setQuantity(1)
  }

  const handleQuantityChange = (value: number) => {
    if (product) {
      const newQuantity = Math.max(1, Math.min(value, product.stock))
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-lg">Đang tải chi tiết sách...</div>
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm</p>
          <Button asChild variant="outline">
            <Link href="/products">
              <IconArrowLeft size={16} className="mr-2" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button asChild variant="outline" className="mb-6 bg-transparent">
        <Link href="/products">
          <IconArrowLeft size={16} className="mr-2" />
          Quay lại danh sách
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex items-center justify-center">
          <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            {product.coverImage ? (
              <Image src={product.coverImage || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Không có hình ảnh</div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-lg text-indigo-950">Tác giả: {product.author}</p>
          </div>

          {/* Price */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-950 mb-1">Giá bán</p>
            <p className="text-3xl font-bold text-blue-600">{product.price.toLocaleString("vi-VN")}₫</p>
          </div>

          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin sách</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-indigo-950">Danh mục:</span>
                <span className="font-medium">{product.category?.name || "Khác"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-950">Mã ISBN:</span>
                <span className="font-medium">{product.ISSN}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-950">Năm xuất bản:</span>
                <span className="font-medium">{product.publishYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-950">Số trang:</span>
                <span className="font-medium">{product.pages}</span>
              </div>
              {product.volume && (
                <div className="flex justify-between">
                  <span className="text-indigo-950">Tập:</span>
                  <span className="font-medium">{product.volume}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-indigo-950">Kho hàng:</span>
                <span className={`font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                  {isOutOfStock ? "Hết hàng" : `${product.stock} cuốn`}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-indigo-950 font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3"
                >
                  <IconMinus size={16} />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  disabled={isOutOfStock}
                  className="w-12 text-center border-0 outline-none"
                  min="1"
                  max={product.stock}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3"
                >
                  <IconPlus size={16} />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <IconShoppingCart size={20} />
              {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
