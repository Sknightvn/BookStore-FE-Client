import { useState, useEffect } from "react"
import { IconCategory2, IconChevronLeft, IconChevronRight, IconFlame } from "@tabler/icons-react"
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
  ISSN?: string
  publishYear?: number
  pages?: number
  description?: string
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

  // Calculate the range of thumbnails to display (4 images around current)
  const getThumbnailRange = () => {
    const totalProducts = categoryProducts.length
    if (totalProducts <= 4) {
      return { start: 0, end: totalProducts }
    }

    // Try to keep current image in the middle
    let start = Math.max(0, currentImageIndex - 1)
    let end = Math.min(totalProducts, start + 4)

    // Adjust if we're at the end
    if (end - start < 4) {
      start = Math.max(0, end - 4)
    }

    return { start, end }
  }

  const { start: thumbnailStart, end: thumbnailEnd } = getThumbnailRange()

  return (
    <section className="overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Category Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-2">
              <span className="text-indigo-950 bg-indigo-800 w-1.5 h-6 rounded-full inline-block mr-2 translate-y-0.5"></span>
              <span>Khám phá danh mục</span>
            </h2>
            <p className="text-indigo-950 text-xl">Duyệt qua các bộ sưu tập sách yêu thích</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevCategory}
              className="rounded-full border-2 group border-indigo-500 hover:bg-indigo-500 bg-transparent"
            >
              <IconChevronLeft size={24} className="text-indigo-500 group-hover:text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextCategory}
              className="rounded-full border-2 group border-indigo-500 hover:bg-indigo-500 bg-transparent"
            >
              <IconChevronRight size={24} className="text-indigo-500 group-hover:text-white" />
            </Button>
          </div>
        </div>

        {/* Category Slider */}
        <div className="flex gap-3 flex-wrap pb-6">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(index)}
              className={`px-5 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${activeCategory === index
                ? "bg-gradient-to-r from-indigo-500 to-blue-400 text-white shadow-lg"
                : "bg-white text-indigo-800 font-normal border border-indigo-500 hover:border-indigo-400"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Banner with Product Carousel */}
        {currentProduct && (
          <div
            style={{
              backgroundImage: `url(/stacked-waves-haikei.svg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="grid grid-cols-1 rounded-2xl p-4 md:grid-cols-2 gap-8 items-center">
            {/* Product Image Section */}
            <div className="relative group">
              <div className="bg-white rounded-2xl flex justify-center items-center overflow-hidden shadow-xl">
                <img
                  src={currentProduct.coverImage || "/placeholder.svg"}
                  alt={currentProduct.title}
                  className="w-auto h-80 p-4 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Thumbnails Preview */}
              {categoryProducts.length > 1 && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {categoryProducts.slice(thumbnailStart, thumbnailEnd).map((product, idx) => {
                      const actualIndex = thumbnailStart + idx
                      return (
                        <button
                          key={product._id}
                          onClick={() => setCurrentImageIndex(actualIndex)}
                          className={`relative rounded-lg overflow-hidden transition-all duration-300 ${actualIndex === currentImageIndex
                            ? "ring-2 ring-indigo-500 shadow-lg scale-105 opacity-100"
                            : "ring-2 ring-gray-300 hover:ring-indigo-300 opacity-70 hover:opacity-100"
                            }`}
                        >
                          <img
                            src={product.coverImage || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-24 object-cover"
                          />
                          {actualIndex === currentImageIndex && (
                            <div className="absolute inset-0 bg-indigo-500 bg-opacity-20"></div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Image Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevImage}
                      className="rounded-full !w-20 h-9 bg-transparent border-2 border-indigo-500 hover:bg-indigo-100"
                    >
                      <IconChevronLeft size={16} className="text-indigo-500" />
                    </Button>
                    <span className="text-sm font-semibold text-white bg-indigo-500 px-3 py-2 rounded-full">
                      {currentImageIndex + 1} / {categoryProducts.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextImage}
                      className="rounded-full !w-20 h-9 bg-transparent border-2 border-indigo-500 hover:bg-indigo-100"
                    >
                      <IconChevronRight size={16} className="text-indigo-500" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-4 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-fit flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold mb-3">
                    <IconFlame size={18} className="text-white" />
                    Hot sale
                  </div>
                  <div className="w-fit flex items-center gap-2 px-3 py-1 bg-[#E1CAAB] text-indigo-950 rounded-full text-sm font-semibold mb-3">
                    <IconCategory2 size={18} className="text-indigo-950" />
                    <span>
                      {categories[activeCategory]}
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-medium text-indigo-400 mb-2 leading-tight">
                  {currentProduct.title}
                  {currentProduct.volume && ` | Tập: ${currentProduct.volume}`}
                </h3>
                <p className="text-[#E1CAAB] text-base font-semibold">Tác giả: {currentProduct.author}</p>
              </div>

              <div className="flex items-baseline gap-4 flex-wrap text-sm">
                <p className="text-4xl md:text-5xl font-normal text-white mb-4">
                  {currentProduct.price.toLocaleString("vi-VN")}
                  <span className="text-3xl ml-1">đ</span>
                </p>
                {currentProduct.stock > 0 ? (
                  <span className="text-green-500 font-semibold text-base">✓ Còn hàng</span>
                ) : (
                  <span className="text-red-500 font-semibold text-base">✗ Hết hàng</span>
                )}
              </div>

              {/* Description */}
              {currentProduct.description && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-[#E1CAAB] text-base font-semibold mb-2">Mô tả</p>
                  <p className="text-white text-sm leading-relaxed line-clamp-3">
                    {currentProduct.description}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-white font-semibold text-base"
                >
                  <Link href="/products">Khám phá thêm</Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="bg-[#6366F1] hover:bg-[#5558e3] text-white font-semibold text-base"
                >
                  <Link href={`/products/${currentProduct._id}`}>Xem chi tiết</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
