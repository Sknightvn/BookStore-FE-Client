"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { IconMapPinCog } from "@tabler/icons-react"
import CategoryBanner from "@/components/category-banner"
import WeeklyRanking from "@/components/weekly-ranking"
import ImageCarousel from "@/components/image-carousel"
import { TruckOutlined, GiftOutlined, PhoneOutlined, CustomerServiceOutlined } from "@ant-design/icons"
import { useBooks } from "@/hooks/useBooks"
import Image from "next/image"
import { FeaturedProductCard } from "@/components/product-card"

export default function HomePage() {
  const { data: booksData, isLoading: loading } = useBooks()

  const products = booksData?.data || []
  const featuredBooks = useMemo(() => products.slice(0, 10), [products])
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((b) => b?.category?.name ?? "Khác")))
    return ["Tất cả", ...uniqueCategories]
  }, [products])

  return (
    <div className="space-y-12">
      {/* Hero Section */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ImageCarousel />
        {/* Buttons Section */}
        <h2 className="text-2xl font-semibold text-indigo-800 my-6 mt-12">
          <span className="text-indigo-950 bg-indigo-800 w-1.5 h-5 rounded-full inline-block mr-2 translate-y-0.5"></span>
          <span>Dịch vụ & Hỗ trợ</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <TruckOutlined style={{ fontSize: "20px", fontWeight: "light" }} />,
              title: "Giao hàng",
              description: "Giao hàng nhanh chóng",
            },
            {
              icon: <GiftOutlined style={{ fontSize: "20px" }} />,
              title: "Shipping",
              description: "Free shipping đơn hàng trên 200k",
            },
            {
              icon: <CustomerServiceOutlined style={{ fontSize: "20px" }} />,
              title: "Hỗ trợ",
              description: "Hỗ trợ mọi lúc, mọi nơi",
            },
            {
              icon: <PhoneOutlined style={{ fontSize: "20px" }} />,
              title: "Hotline",
              description: "Hotline: 0946280159",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Image
                draggable={false}
                src={`/service-${index + 1}.png`}
                alt={item.title}
                width={200}
                height={200}
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                quality={100}
              />
              <p className="text-base text-center font-semibold w-full text-[#E1CAAB] absolute bottom-3 transition-colors duration-300 group-hover:text-white">
                {item.description}
              </p>
              <div className="h-10 w-10 flex justify-center items-center z-10 bg-indigo-950 rounded-full absolute top-4 left-4 text-[#E1CAAB] shadow-md transition-all duration-300 group-hover:translate-y-0.5 group-hover:-translate-x-0.5">
                {item.icon}
              </div>
              <div className="h-12 w-32 bg-[#F7F7F7] rounded-full absolute top-3 left-3 z-0 opacity-90 transition-all duration-300 group-hover:bg-orange-100 group-hover:opacity-100 group-hover:translate-y-0.5 group-hover:-translate-x-0.5" />
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!loading && categories.length > 0 && <CategoryBanner categories={categories} products={products} />}
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
              <span className="text-indigo-950 bg-indigo-800 w-1.5 h-5 rounded-full inline-block mr-2 translate-y-0.5"></span>
              <span>Sách nổi bật</span>
            </h2>
        {loading ? (
          <p className="text-center text-indigo-950">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
            {featuredBooks.map((book) => (
              <FeaturedProductCard key={book._id} product={book} />
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
              <div className="text-4xl font-bold text-indigo-600">10,000+</div>
              <div className="text-indigo-950">Đầu sách</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600">50,000+</div>
              <div className="text-indigo-950">Khách hàng hài lòng</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600">99%</div>
              <div className="text-indigo-950">Đánh giá tích cực</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
