"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"
import CategoryBanner from "@/components/category-banner"
import WeeklyRanking from "@/components/weekly-ranking"
import ImageCarousel from "@/components/image-carousel"
import { TruckOutlined, GiftOutlined, PhoneOutlined } from '@ant-design/icons';
import { useBooks } from "@/hooks/useBooks"
import type { Book } from "@/interface/response/book"

export default function HomePage() {
  const { addToCart } = useCart()
  const { data: booksData, isLoading: loading } = useBooks()

  const products = booksData?.data || []
  const featuredBooks = useMemo(() => products.slice(0, 10), [products])
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((b) => b?.category?.name ?? "Khác")))
    return ["Tất cả", ...uniqueCategories]
  }, [products])

  const handleAddToCart = (book: Book) => {
    if (book.stock <= 0) {
      message.error("Sản phẩm đã hết hàng!")
      return
    }

    addToCart(
      {
        id: book._id,
        title: book.title,
        price: book.price,
        coverImage: book.coverImage,
        volume: book.volume || "",
      },
      1,
    )

    message.success(`Đã thêm "${book.title}" vào giỏ hàng!`)
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ImageCarousel />
        {/* Buttons Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Ship Toàn Quốc */}
          <div className="flex items-center border-2 border-gray-300 text-gray-900 py-3 px-4 rounded-lg shadow-sm hover:border-orange-500 transition-all">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-full mr-3">
              <TruckOutlined style={{ fontSize: '24px', color: '#FF5722' }} />
            </div>
            <div className="text-sm">
              <h5 className="font-semibold">Ship toàn quốc</h5>
              <p className="text-xs">Giao hàng nhanh chóng</p>
            </div>
          </div>

          {/* Miễn Phí Đơn Hàng Trên 200k */}
          <div className="flex items-center border-2 border-gray-300 text-gray-900 py-3 px-4 rounded-lg shadow-sm hover:border-green-500 transition-all">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-full mr-3">
              <GiftOutlined style={{ fontSize: '24px', color: '#4CAF50' }} /> {/* Ant Design Gift Icon */}
            </div>
            <div className="text-sm">
              <h5 className="font-semibold">Miễn phí đơn trên 200k</h5>
              <p className="text-xs">Miễn phí phí ship khi đơn hàng trên 200k</p>
            </div>
          </div>

          {/* Hỗ Trợ 24/7 */}
          <div className="flex items-center border-2 border-gray-300 text-gray-900 py-3 px-4 rounded-lg shadow-sm hover:border-purple-500 transition-all">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-full mr-3">
              <TruckOutlined style={{ fontSize: '24px', color: '#9C27B0' }} /> {/* Ant Design Headset Icon */}
            </div>
            <div className="text-sm">
              <h5 className="font-semibold">Hỗ trợ 24/7</h5>
              <p className="text-xs">Hỗ trợ mọi lúc, mọi nơi</p>
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center border-2 border-gray-300 text-gray-900 py-3 px-4 rounded-lg shadow-sm hover:border-yellow-500 transition-all">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-full mr-3">
              <PhoneOutlined style={{ fontSize: '24px', color: '#FF9800' }} /> {/* Ant Design Phone Icon */}
            </div>
            <div className="text-sm">
              <h5 className="font-semibold">0946280159</h5>
              <p className="text-xs">Liên hệ để được hỗ trợ</p>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!loading && categories.length > 0 && <CategoryBanner categories={categories} products={products} />}
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold mb-4">Sách nổi bật</h2>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredBooks.map((book) => (
              <Card key={book._id} className="group hover:shadow-xl transition cursor-pointer">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-64 object-cover rounded-t"
                    />

                    {book.stock <= 0 && <Badge className="absolute top-2 right-2 bg-gray-500">Hết hàng</Badge>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4">
                  <h3 className="font-semibold group-hover:text-blue-600">{book.title}</h3>
                  <p className="text-sm text-gray-600">Tập: {book.volume || "Không có"}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.5</span>
                  </div>

                  <p className="font-bold text-red-600">{book.price.toLocaleString("vi-VN")}đ</p>

                  <Button size="sm" className="w-full" onClick={() => handleAddToCart(book)} disabled={book.stock <= 0}>
                    {book.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" asChild size="lg">
            <Link href="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      </section>

      {/* Weekly Ranking Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WeeklyRanking />
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Đầu sách</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">50,000+</div>
              <div className="text-gray-600">Khách hàng hài lòng</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">99%</div>
              <div className="text-gray-600">Đánh giá tích cực</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
