"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconArrowLeft,
  IconShoppingCart,
  IconMinus,
  IconPlus,
  IconCategory2,
  IconBarcode,
  IconCalendar,
  IconBook2,
  IconLayersSubtract,
  IconBuildingWarehouse,
  IconUserSquareRounded,
  IconStar,
  IconTruck,
  IconRefresh,
  IconHeartHandshake,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandX,
  IconShare3,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"
import { useParams } from "next/navigation"
import { useBook, useBooks } from "@/hooks/useBooks"
import ProductCard, { FeaturedProductCard } from "@/components/product-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { data: productData, isLoading: loading } = useBook(productId)
  const product = productData?.data || null

  const { data: booksData } = useBooks()
  const allBooks = booksData?.data || []
  const similarBooks = allBooks
    .filter(
      (b) =>
        b._id !== product?._id &&
        b.category?._id &&
        product?.category?._id &&
        b.category._id === product.category._id,
    )
    .slice(0, 4)

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
    return <div className="text-center py-12 text-indigo-950 text-lg">Đang tải chi tiết sách...</div>
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-indigo-950 text-lg mb-4">Không tìm thấy sản phẩm</p>
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
      {/* Breadcrumb + Back */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Danh mục sách</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex items-center justify-center">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            {product.coverImage ? (
              <Image src={product.coverImage || "/placeholder.svg"} alt={product.title} fill className="object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Không có hình ảnh</div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6 rounded-xl border border-indigo-100 bg-white/80 p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-semibold text-indigo-950 mb-1 line-clamp-2">{product.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <IconStar key={index} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="flex items-center gap-2 text-sm font-semibold text-indigo-700 border border-indigo-500 rounded-full px-3 bg-indigo-50">
                <IconUserSquareRounded size={16} className="text-indigo-500" />
                <span>{product.author}</span>
              </p>
              {!isOutOfStock && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-3 text-xs font-medium text-green-700 border border-green-500 h-fit py-1">
                  Còn {product.stock} cuốn
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex gap-4 items-baseline">
            <div>
              <p className="text-4xl font-semibold text-indigo-600">
                {product.price.toLocaleString("vi-VN")}₫
              </p>
            </div>

          </div>

          {/* Product Info */}
          <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="text-lg">Thông tin sách</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconCategory2 size={16} className="text-indigo-500" />
                  Danh mục:
                </span>
                <span className="font-medium">{product.category?.name || "Khác"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconBarcode size={16} className="text-indigo-500" />
                  Mã ISBN:
                </span>
                <span className="font-medium">{product.ISSN}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconCalendar size={16} className="text-indigo-500" />
                  Năm xuất bản:
                </span>
                <span className="font-medium">{product.publishYear}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconBook2 size={16} className="text-indigo-500" />
                  Số trang:
                </span>
                <span className="font-medium">{product.pages}</span>
              </div>
              {product.volume && (
                <div className="flex items-center justify-between">
                  <span className="text-indigo-950 flex items-center gap-2">
                    <IconLayersSubtract size={16} className="text-indigo-500" />
                    Tập:
                  </span>
                  <span className="font-medium">{product.volume}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconBuildingWarehouse size={16} className="text-indigo-500" />
                  Kho hàng:
                </span>
                <span className={`font-medium ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
                  {isOutOfStock ? "Hết hàng" : `${product.stock} cuốn`}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden">
              <CardHeader className="bg-indigo-100">
                <CardTitle className="text-lg">Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-950 leading-relaxed">{product.description}</p>
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
              variant="fulled"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              size="lg"
              className="w-full"
            >
              <IconShoppingCart size={20} className="mr-1" />
              {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </Button>

            {/* Services / Benefits */}
            <div className="flex flex-col gap-3 pt-2 border-t border-indigo-100 mt-2">
              {[
                {
                  icon: IconTruck,
                  title: "Miễn phí vận chuyển",
                  description: "Cho đơn hàng từ 300.000₫",
                },
                {
                  icon: IconHeartHandshake,
                  title: "Nhấn và sưu tầm",
                  description: "Thêm vào bộ sưu tập yêu thích",
                },
                {
                  icon: IconRefresh,
                  title: "Hoàn trả dễ dàng",
                  description: "Đổi trả trong 7 ngày",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-2 bg-indigo-50 p-3 rounded-lg">
                  <Icon size={24} className="mt-0.5 text-indigo-500" />
                  <div>
                    <p className="text-base font-semibold text-indigo-900">{title}</p>
                    <p className="text-sm text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share section */}
            <div className="pt-4 border-t border-indigo-100">
              <p className="text-base font-medium text-indigo-900 mb-2">Chia sẻ:</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-[#1877f2] hover:bg-[#1453a8] text-white"
                  aria-label="Chia sẻ lên Facebook"
                >
                  <IconBrandFacebook size={18} className="text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gradient-to-tr from-[#feda75] via-[#e1306c] to-[#4f5bd5] text-white"
                  aria-label="Chia sẻ lên Instagram"
                >
                  <IconBrandInstagram size={18} className="text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-slate-900 hover:bg-black text-white"
                  aria-label="Chia sẻ lên X"
                >
                  <IconBrandX size={18} className="text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"
                  aria-label="Sao chép / chia sẻ liên kết"
                >
                  <IconShare3 size={18} className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarBooks.length > 0 && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-2">
              <span className="text-indigo-950 bg-indigo-800 w-1.5 h-5 rounded-full inline-block mr-2 translate-y-0.5"></span>
              <span>Sản phẩm tương tự</span>
            </h2>
            <Link href="/products" className="text-sm text-indigo-600 hover:text-indigo-700 underline">
              Xem thêm
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarBooks.map((book) => (
              <FeaturedProductCard key={book._id} product={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
