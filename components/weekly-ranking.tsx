"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"
import { useTopProducts } from "@/hooks/useBooks"
import type { TopProduct } from "@/interface/response/book"

export default function WeeklyRanking() {
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [selectedBook, setSelectedBook] = useState<TopProduct | null>(null)

  // Use React Query hook
  const { data: topProductsData, isLoading: loading } = useTopProducts()
  const topProducts = topProductsData?.data || []

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        topProducts
          .map((p: TopProduct) => p.category)
          .filter((cat: string | undefined): cat is string => Boolean(cat))
      )
    )
    return Array.isArray(uniqueCategories) && uniqueCategories.length > 0
      ? ["Tất cả", ...uniqueCategories]
      : ["Tất cả"]
  }, [topProducts])

  // Filter products based on selected category
  const rankedBooks = useMemo(() => {
    let filtered = topProducts
    if (selectedCategory !== "Tất cả") {
      filtered = topProducts.filter((p: TopProduct) => p.category === selectedCategory)
    }
    return filtered.slice(0, 5)
  }, [selectedCategory, topProducts])

  // Set initial selected book
  useEffect(() => {
    if (rankedBooks.length > 0 && !selectedBook) {
      setSelectedBook(rankedBooks[0])
    }
  }, [rankedBooks, selectedBook])

  const handleAddToCart = (book: TopProduct) => {
    if (!book.productId) {
      message.error("Sản phẩm không hợp lệ")
      return
    }

    addToCart(
      {
        id: book.productId,
        title: book.title,
        price: book.price || 0,
        coverImage: book.coverImage || book.image || "/placeholder.svg",
        volume: book.volume || "",
      },
      1,
    )

    message.success(`Đã thêm "${book.title}" vào giỏ hàng!`)
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Đang tải xếp hạng...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-2xl font-bold">Bảng xếp hạng bán chạy</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 px-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 whitespace-nowrap rounded transition-all ${selectedCategory === cat
              ? "bg-red-500 text-white font-semibold"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranked List */}
        <div className="lg:col-span-2 space-y-3">
          {rankedBooks.length > 0 ? (
            rankedBooks.map((book, index) => (
              <div
                key={book.productId}
                onClick={() => setSelectedBook(book)}
                className={`flex gap-4 p-4 rounded-lg cursor-pointer transition-all ${selectedBook?.productId === book.productId
                  ? "bg-red-50 border-2 border-red-500"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {/* Ranking Number */}
                <div className="flex flex-col items-center justify-center min-w-12">
                  <span className="text-xl font-bold text-gray-900">{String(index + 1).padStart(2, "0")}</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>

                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <img
                    src={book.coverImage || book.image || "/placeholder.svg"}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                </div>

                {/* Book Info */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author || "Không rõ tác giả"}</p>
                  <p className="text-sm text-blue-600 font-medium">{book.category || "Khác"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{book.totalQuantity} bán</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">Không có sản phẩm bán chạy</div>
          )}
        </div>

        {/* Featured Product Detail */}
        {selectedBook && (
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="p-0">
                <img
                  src={selectedBook.coverImage || selectedBook.image || "/placeholder.svg"}
                  alt={selectedBook.title}
                  className="w-full h-80 object-cover rounded-t"
                />
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-3">{selectedBook.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Tác giả: {selectedBook.author || "Không rõ"}</p>
                  <p className="text-sm text-blue-600 font-medium mt-1">Danh mục: {selectedBook.category || "Khác"}</p>
                  {selectedBook.ISSN && <p className="text-sm text-gray-600">ISBN: {selectedBook.ISSN}</p>}
                </div>

                {/* Sales Statistics */}
                <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Thống kê bán hàng</p>
                  <p className="text-sm text-gray-600">
                    Đã bán: <span className="font-bold text-red-600">{selectedBook.totalQuantity}</span> sản phẩm
                  </p>
                  <p className="text-sm text-gray-600">
                    Doanh thu:{" "}
                    <span className="font-bold text-green-600">
                      {selectedBook.totalRevenue.toLocaleString("vi-VN")}đ
                    </span>
                  </p>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleAddToCart(selectedBook)}
                >
                  Thêm vào giỏ hàng
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
