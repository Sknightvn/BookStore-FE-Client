import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Product {
  _id: string
  title: string
  author: string
  category: {
    _id: string
    name: string
  }
  price: number
  stock: number
  coverImage: string
  volume?: string
}

interface CategoryBannerProps {
  categories: string[]
  products: Product[]
}

export default function CategoryBanner({ categories, products }: CategoryBannerProps) {
  const [activeCategory, setActiveCategory] = useState(0)
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Filter products by active category
  useEffect(() => {
    const filtered = products.filter((p) => {
      const categoryName = p?.category?.name ?? "Khác"
      if (categories[activeCategory] === "Tất cả") {
        return true
      }
      return categoryName === categories[activeCategory]
    })
    setCategoryProducts(filtered)
    setCurrentImageIndex(0)
  }, [activeCategory, categories, products])

  const handlePrevCategory = () => {
    setActiveCategory((prev) => (prev === 0 ? categories.length - 1 : prev - 1))
  }

  const handleNextCategory = () => {
    setActiveCategory((prev) => (prev === categories.length - 1 ? 0 : prev + 1))
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? categoryProducts.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === categoryProducts.length - 1 ? 0 : prev + 1))
  }

  const currentProduct = categoryProducts[currentImageIndex] || categoryProducts[0]

  return (
    <section className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-200 py-16 px-4 rounded-2xl overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Category Navigation */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Khám phá danh mục</h2>
            <p className="text-gray-300">Duyệt qua các bộ sưu tập sách yêu thích</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevCategory}
              className="rounded-full border-2 border-orange-300 hover:bg-orange-100 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextCategory}
              className="rounded-full border-2 border-orange-300 hover:bg-orange-100 bg-transparent"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>

        {/* Category Slider */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeCategory === index
                  ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-orange-200 hover:border-orange-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Banner with Product Carousel */}
        {currentProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Product Image Section */}
            <div className="relative group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={currentProduct.coverImage || "/placeholder.svg"}
                  alt={currentProduct.title}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Image Navigation */}
              {categoryProducts.length > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevImage}
                    className="rounded-full bg-white border-2 border-orange-300 hover:bg-orange-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-semibold text-gray-600">
                    {currentImageIndex + 1} / {categoryProducts.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextImage}
                    className="rounded-full bg-white border-2 border-orange-300 hover:bg-orange-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-4 py-2 bg-orange-200 text-orange-700 rounded-full text-sm font-semibold mb-3">
                  {categories[activeCategory]}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentProduct.title}</h3>
                <p className="text-gray-300 text-lg">{currentProduct.author}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Tập: {currentProduct.volume || "Không có"}</p>
                {currentProduct.stock > 0 ? (
                  <p className="text-sm text-green-600 font-semibold">✓ Còn hàng</p>
                ) : (
                  <p className="text-sm text-red-600 font-semibold">✗ Hết hàng</p>
                )}
              </div>

              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text">
                {currentProduct.price.toLocaleString("vi-VN")}đ
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold"
                  asChild
                >
                  {/* Update link to product detail page */}
                  <Link href={`/products/${currentProduct._id}`}>Xem chi tiết</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold bg-transparent"
                  asChild
                >
                  <Link href="/products">Khám phá thêm</Link>
                </Button>
              </div>

              {/* Dots for products */}
              {categoryProducts.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {categoryProducts.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-orange-500 w-6" : "bg-orange-200 hover:bg-orange-300"
                      }`}
                      aria-label={`Go to product ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
