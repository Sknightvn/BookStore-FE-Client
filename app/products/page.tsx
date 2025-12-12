"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Grid, List } from "lucide-react"
import ProductCard from "@/components/product-card"
import { useBooks } from "@/hooks/useBooks"
import type { Book } from "@/interface/response/book"

export default function ProductsPage() {
  const { data: booksData, isLoading: loading } = useBooks()

  const products = booksData?.data || []
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products.map((b: Book) => (b && b.category && b.category.name ? b.category.name : "Khác"))
      )
    )
    return ["Tất cả", ...uniqueCategories]
  }, [products])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [sortBy, setSortBy] = useState("default")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filteredProducts = useMemo(() => {
    let result = products

    if (selectedCategory !== "Tất cả") {
      result = result.filter((product) => product.category?.name === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.author.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query),
      )
    }

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "newest":
        result = [...result].sort((a, b) => b.publishYear - a.publishYear)
        break
      default:
        break
    }

    return result
  }, [products, searchQuery, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("Tất cả")
    setSortBy("default")
    setCurrentPage(1)
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-lg">Đang tải dữ liệu sách...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh mục sách</h1>
        <p className="text-gray-600">Khám phá hàng ngàn đầu sách chất lượng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm sách, tác giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tất cả"></SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Mặc định</SelectItem>
              <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
              <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1"
            >
              <Grid className="w-4 h-4 mr-1" />
              Lưới
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              <List className="w-4 h-4 mr-1" />
              Danh sách
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tìm kiếm: "{searchQuery}"
              <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-500">
                ×
              </button>
            </Badge>
          )}
          {selectedCategory !== "Tất cả" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Danh mục: {selectedCategory}
              <button onClick={() => setSelectedCategory("Tất cả")} className="ml-1 hover:text-red-500">
                ×
              </button>
            </Badge>
          )}
          {(searchQuery || selectedCategory !== "Tất cả" || sortBy !== "default") && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-red-600 hover:text-red-700">
              <Filter className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Hiển thị {paginatedProducts.length} trong tổng số {filteredProducts.length} sản phẩm
        </p>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              : "space-y-4 mb-8"
          }
        >
          {paginatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm nào</p>
          <Button onClick={handleClearFilters} variant="outline">
            Xóa bộ lọc
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className="w-10 h-10"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}
