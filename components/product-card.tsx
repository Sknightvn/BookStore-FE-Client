"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
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
      volume: product.volume || ""
    },
    1
  )

  message.success(`Đã thêm "${product.title}" vào giỏ hàng!`)
}


  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <Link href={`/products/${product._id}`}>
          <div className="relative w-full h-48 mb-2 bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            {product.coverImage ? (
              <Image src={product.coverImage || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Không có hình ảnh</div>
            )}
          </div>
        </Link>
        <Link href={`/products/${product._id}`} className="hover:text-blue-600">
          <CardTitle className="line-clamp-2 text-base">{product.title}</CardTitle>
        </Link>
        <CardDescription className="text-sm">{product.author}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Danh mục:</span>
            <span className="font-medium">{product.category?.name || "Khác"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Năm xuất bản:</span>
            <span className="font-medium">{product.publishYear}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số trang:</span>
            <span className="font-medium">{product.pages}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-gray-600">Tập:</span>
            <span className="font-medium">{product.volume || "Không có"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kho:</span>
            <span className={`font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
              {isOutOfStock ? "Hết hàng" : `${product.stock} cuốn`}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="text-lg font-bold text-blue-600">{product.price.toLocaleString("vi-VN")}₫</div>
        <Button onClick={handleAddToCart} disabled={isOutOfStock} size="sm" className="gap-2">
          <ShoppingCart className="w-4 h-4" />
          Thêm
        </Button>
      </CardFooter>
    </Card>
  )
}
