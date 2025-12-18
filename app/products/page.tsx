"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IconSearch, IconFilter, IconLayoutGrid, IconList } from "@tabler/icons-react"
import ProductCard from "@/components/product-card"
import { useBooks } from "@/hooks/useBooks"
import type { Book } from "@/interface/response/book"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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

  // Generate pagination items with ellipsis
  const paginationItems = useMemo(() => {
    const items: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      // Always show first page
      items.push(1)

      if (currentPage <= 3) {
        // Near the beginning: 1, 2, 3, 4, ..., last
        for (let i = 2; i <= 4; i++) {
          items.push(i)
        }
        items.push("...")
        items.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end: 1, ..., last-3, last-2, last-1, last
        items.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        // In the middle: 1, ..., current-1, current, current+1, ..., last
        items.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i)
        }
        items.push("...")
        items.push(totalPages)
      }
    }

    return items
  }, [totalPages, currentPage])

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
      {/* Breadcrumb + Header */}
      <div className="mb-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh mục sách</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-2">
              <span className="text-indigo-950 bg-indigo-800 w-1.5 h-6 rounded-full inline-block mr-2 translate-y-0.5"></span>
              <span>Danh mục sách</span>
            </h2>
            <p className="text-indigo-950 text-xl">Khám phá hàng ngàn đầu sách chất lượng</p>
          </div>
      </div>

      {/* Sidebar and Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar - Filters */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>
            
            {/* Search */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Tìm kiếm</label>
              <div className="relative">
                <IconSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sách, tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Danh mục</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tất cả">Tất cả</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sắp xếp</label>
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
            </div>

            {/* Active Filters */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-500">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "Tất cả" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("Tất cả")} className="ml-1 hover:text-red-500">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory !== "Tất cả" || sortBy !== "default") && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters} 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <IconFilter size={16} className="mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </aside>

        {/* Main Content - Products */}
        <main className="lg:col-span-3">
          {/* Results Info and View Mode */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <p className="text-indigo-950">
              Hiển thị {paginatedProducts.length} trong tổng số {filteredProducts.length} sản phẩm
            </p>
            
            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <IconLayoutGrid size={16} className="mr-1" />
                Lưới
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <IconList size={16} className="mr-1" />
                Danh sách
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8"
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
            <div className="flex items-center justify-center space-x-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              {paginationItems.map((item, index) => {
                if (item === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  )
                }
                return (
                  <Button
                    key={item}
                    variant={currentPage === item ? "default" : "outline"}
                    onClick={() => setCurrentPage(item as number)}
                    className="w-10 h-10"
                  >
                    {item}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
