"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { IconMapPinCog, IconBooks, IconFriends, IconBubbleText } from "@tabler/icons-react"
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
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 pt-4">
        <ImageCarousel />
        {/* Buttons Section */}
        <h2 className="text-2xl font-semibold text-indigo-800 my-4 mt-12">
          <span className="text-indigo-950 bg-indigo-800 w-1.5 h-5 rounded-full inline-block mr-2 translate-y-0.5"></span>
          <span>Dịch vụ & Hỗ trợ</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <TruckOutlined style={{ fontSize: "20px", fontWeight: "light" }} />,
              title: "Shipping",
              description: "Giao hàng nhanh chóng",
            },
            {
              icon: <GiftOutlined style={{ fontSize: "20px" }} />,
              title: "Free",
              description: "Free shipping đơn hàng trên 200k",
            },
            {
              icon: <CustomerServiceOutlined style={{ fontSize: "20px" }} />,
              title: "Support",
              description: "Hỗ trợ mọi lúc, mọi nơi",
            },
            {
              icon: <PhoneOutlined style={{ fontSize: "20px" }} />,
              title: "24/7",
              description: "Hotline: 0946280159",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
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
              <div className="h-10 w-10 flex justify-center items-center z-10 bg-indigo-950 rounded-full absolute top-4 left-4 text-[#E1CAAB] shadow-sm transition-all duration-300 group-hover:translate-y-0.5 group-hover:-translate-x-0.5">
                {item.icon}
              </div>
              <div className="h-12 w-32 bg-[#E1CAAB] rounded-full absolute top-3 left-3 z-0 transition-all duration-300 group-hover:bg-orange-100 group-hover:translate-y-0.5 group-hover:-translate-x-0.5 flex justify-end items-center">
                <p className="text-base ml-[50px] text-start font-semibold w-full text-indigo-950">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        {!loading && <CategoryBanner products={products} />}
      </section>
      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
          <span className="text-indigo-950 bg-indigo-800 w-1.5 h-5 rounded-full inline-block mr-2 translate-y-0.5"></span>
          <span>Sách nổi bật</span>
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="text-indigo-950 font-medium">Đang tải sản phẩm...</p>
            </div>
          </div>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <WeeklyRanking />
      </section>

      {/* Stats Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 relative z-10">
          <p className="text-indigo-700 text-lg max-w-2xl mx-auto mb-8">
            Những con số ấn tượng phản ánh sự tin tưởng và hài lòng của khách hàng
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            {[
              {
                icon: IconBooks,
                value: "10,000+",
                label: "Đầu sách",
                description: "Sách đa dạng thể loại",
                gradient: "from-indigo-500 to-indigo-600",
                bgGradient: "from-indigo-100 to-indigo-50",
              },
              {
                icon: IconFriends,
                value: "50,000+",
                label: "Khách hàng hài lòng",
                description: "Tin tưởng và ủng hộ",
                gradient: "from-purple-500 to-purple-600",
                bgGradient: "from-purple-100 to-purple-50",
              },
              {
                icon: IconBubbleText,
                value: "99%",
                label: "Đánh giá tích cực",
                description: "Chất lượng dịch vụ",
                gradient: "from-amber-500 to-amber-600",
                bgGradient: "from-amber-100 to-amber-50",
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-indigo-100"
                  tabIndex={0}
                  role="article"
                  aria-label={`${stat.label}: ${stat.value}`}
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${stat.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={32} stroke={2} />
                    </div>

                    {/* Value */}
                    <div className={`text-5xl font-light bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300`}>
                      {stat.value}
                    </div>

                    {/* Label */}
                    <div className="text-xl font-semibold text-indigo-950 mb-2">
                      {stat.label}
                    </div>

                    {/* Description */}
                    <div className="text-sm text-indigo-600">
                      {stat.description}
                    </div>
                  </div>

                  {/* Decorative corner element */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full rounded-tr-2xl`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
