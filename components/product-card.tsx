"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconShoppingCart, IconStar } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"

interface Category {
  _id: string
  name: string
}

interface Product {
  _id: string
  title: string
  author: string
  ISSN: string
  category: Category
  price: number
  stock: number
  publishYear: number
  pages: number
  coverImage: string
  description: string
  volume?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    addToCart(
      {
        id: product._id,
        title: product.title,
        price: product.price,
        coverImage: product.coverImage,
        volume: product.volume || "",
      },
      1,
    )

    message.success(`Đã thêm "${product.title}" vào giỏ hàng!`)
  }

  return (
    <Card 
    style={{
      background: "url('/layered-waves-haikei.svg') no-repeat center center",
      backgroundSize: "cover",
      backgroundPosition: "bottom",
      backgroundRepeat: "no-repeat",
    }}
    className="flex flex-col h-full hover:shadow-lg cursor-pointer hover:translate-y-2 transition-all duration-300 !border-indigo-300">
      <CardHeader className="pb-2">
        <Link href={`/products/${product._id}`}>
          <div className="relative w-full h-48 mb-2 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            {product.coverImage ? (
              <Image src={product.coverImage || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Không có hình ảnh</div>
            )}
          </div>
        </Link>
        <Link href={`/products/${product._id}`} className="hover:text-blue-600 !text-white text-xl">
          <CardTitle className="line-clamp-2 text-xl !text-white">{product.title}</CardTitle>
        </Link>
        <CardDescription className="text-sm text-gray-200 flex justify-between">
        <span className="text-gray-200 text-sm">Tác giả:</span>
        <span className="font-medium px-3 py-1 text-indigo-950 rounded-full bg-[#E1CAAB]">{product.author}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-200 text-sm">Danh mục:</span>
            <span className="font-medium text-[#E1CAAB]">{product.category?.name || "Khác"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-200 text-sm">Năm xuất bản:</span>
            <span className="font-medium text-[#E1CAAB]">{product.publishYear}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-200 text-sm">Số trang:</span>
            <span className="font-medium text-[#E1CAAB]">{product.pages}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-200 text-sm">Tập:</span>
            <span className="font-medium text-[#E1CAAB]">{product.volume || "Không có"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-200 text-sm">Kho:</span>
            <span className={`font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
              {isOutOfStock ? "Hết hàng" : `${product.stock} cuốn`}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-t-indigo-500">
        <div className="text-lg font-bold text-indigo-400">{product.price.toLocaleString("vi-VN")}₫</div>
        <Button onClick={handleAddToCart} disabled={isOutOfStock} size="sm" className="gap-2" variant="fulled">
          <IconShoppingCart size={16} />
          Thêm
        </Button>
      </CardFooter>
    </Card>
  )
}

export function FeaturedProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    if (isOutOfStock) {
      message.error("Sản phẩm đã hết hàng!")
      return
    }

    addToCart(
      {
        id: product._id,
        title: product.title,
        price: product.price,
        coverImage: product.coverImage,
        volume: product.volume || "",
      },
      1,
    )

    message.success(`Đã thêm "${product.title}" vào giỏ hàng!`)
  }

  return (
    <Card className="group hover:shadow-xl overflow-hidden bg-indigo-950 transition cursor-pointer rounded-xl">
      <CardHeader className="p-2">
        <div className="relative">
          <img
            src={product.coverImage || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-56 object-cover rounded-lg"
          />

          {product.stock <= 0 && <Badge className="absolute top-2 right-2 bg-gray-500">Hết hàng</Badge>}
        </div>
      </CardHeader>

      <CardContent
        style={{
          background: "url('/circle-scatter-haikei.svg') no-repeat center center",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="space-y-2 p-2"
      >
        <h3 className="font-semibold text-xl text-white hover:text-indigo-500">
          <span> {product.title}</span>
          <span className="text-sm text-white"> | </span>
          <span className="text-sm text-white">Tập: {product.volume || "Không có"}</span>
        </h3>

        <p className="text-sm text-white">{product.author}</p>

        <div className="flex items-center gap-1 text-base text-gray-300">
          {Array.from({ length: 5 }).map((_, index) => (
            <IconStar key={index} size={16} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <p className="text-2xl font-medium text-red-500">{product.price.toLocaleString("vi-VN")}đ</p>

        <Button
          size="sm"
          className="w-full"
          variant="fulled"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
        </Button>
      </CardContent>
    </Card>
  )
}
