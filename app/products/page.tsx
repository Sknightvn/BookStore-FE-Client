"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IconSearch, IconFilter, IconLayoutGrid, IconList, IconFilter2Search } from "@tabler/icons-react"
import ProductCard from "@/components/product-card"
import Image from "next/image"
import { useBooks } from "@/hooks/useBooks"
import { useCategories } from "@/hooks/useCategories"
import type { Book } from "@/interface/response/book"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  const headerRef = useRef<HTMLDivElement>(null)
  const scrollAnimationRef = useRef<number | null>(null)

  const { data: booksData, isLoading: loading } = useBooks(currentPage, itemsPerPage)
  const { data: categoriesData } = useCategories()

  const products = booksData?.data || []
  const pagination = booksData?.pagination
  const totalPages = pagination?.totalPages || 1
  const total = pagination?.total || 0

  const categories = useMemo(() => {
    const categoryNames = categoriesData?.data?.map((cat) => cat.name) || []
    return ["Tất cả", ...categoryNames]
  }, [categoriesData])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [sortBy, setSortBy] = useState("default")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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

  const paginatedProducts = filteredProducts

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

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  // Scroll to top when page changes with custom smooth animation
  useEffect(() => {
    if (typeof window === "undefined") return

    // Cancel any existing animation
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current)
    }

    const startY = window.scrollY || window.pageYOffset

    let targetY = 0
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect()
      const offset = 80 // keep a little space from the very top
      targetY = rect.top + startY - offset
    }

    const distance = targetY - startY
    const duration = 700 // ms
    const startTime = performance.now()

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)

      window.scrollTo(0, startY + distance * eased)

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(step)
      } else {
        scrollAnimationRef.current = null
      }
    }

    scrollAnimationRef.current = requestAnimationFrame(step)

    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
        scrollAnimationRef.current = null
      }
    }
  }, [currentPage, headerRef])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-indigo-950 font-medium">Đang tải dữ liệu sách...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-8">
      {/* Breadcrumb + Header */}
      <div ref={headerRef} className="mb-8 space-y-4 scroll-mt-8">
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
      </div>

      {/* Sidebar and Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar - Filters */}
        <aside className="lg:col-span-1 border-none">
          <div className="rounded-lg shadow-sm border border-indigo-300 sticky top-8 bg-indigo-100 overflow-hidden">
            <div className="flex bg-indigo-100 p-2  items-center space-x-2 font-semibold text-indigo-950 leading-none tracking-tight">
              <IconFilter2Search size={20} className="text-indigo-700" />
              <span className="text-indigo-700 text-lg">Bộ lọc</span></div>
            <div className="border-t border-indigo-300"></div>
            {/* Search */}
            <div className="p-2 bg-white">
              <label className="text-base font-medium text-indigo-950 mb-2 block">Tìm kiếm:</label>
              <div className="relative">
                <IconSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sách, tác giả..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleFilterChange()
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="p-2 bg-white">
              <label className="text-base font-medium text-indigo-950 mb-2 block">Danh mục:</label>
              <Select value={selectedCategory} onValueChange={(value) => {
                setSelectedCategory(value)
                handleFilterChange()
              }}>
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
            <div className="p-2 bg-white">
              <label className="text-base font-medium text-indigo-950 mb-2 block">Sắp xếp:</label>
              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value)
                handleFilterChange()
              }}>
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
            <div className="p-2 bg-white">
              <div className="flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <Badge variant="default" className="flex items-center gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-500">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "Tất cả" && (
                  <Badge variant="default" className="flex items-center gap-1 border-indigo-300 bg-indigo-700">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("Tất cả")} className="ml-1 hover:text-red-500">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-2 bg-white">
              {/* Clear Filters */}
              {(searchQuery || selectedCategory !== "Tất cả" || sortBy !== "default") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="w-full text-red-500 hover:text-red-700 border-red-500 bg-red-100  hover:bg-red-50"
                >
                  <IconFilter size={16} className="mr-1" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content - Products */}
        <main className="lg:col-span-3">
          {/* Results Info and View Mode */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <p className="text-indigo-950 text-lg">
              Hiển thị {paginatedProducts.length} trong tổng số {total} sản phẩm
            </p>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "fulled" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <IconLayoutGrid size={16} className="mr-1" />
                Lưới
              </Button>
              <Button
                variant={viewMode === "list" ? "fulled" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <IconList size={16} className="mr-1" />
                Danh sách
              </Button>
            </div>
          </div>

          {/* Products Grid / List */}
          {paginatedProducts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mb-8 overflow-hidden rounded-lg border border-indigo-200 bg-white shadow-sm">
                <Table>
                  <TableHeader className="bg-indigo-50">
                    <TableRow>
                      <TableHead className="w-[64px]"></TableHead>
                      <TableHead>Sách</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Kho</TableHead>
                      <TableHead>Năm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="w-[64px]">
                          <div className="relative h-12 w-10 overflow-hidden rounded">
                            {product.coverImage ? (
                              <Image
                                src={product.coverImage}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-xs text-indigo-500">
                                N/A
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-indigo-950">{product.title}</span>
                            <span className="text-xs text-indigo-950">Tác giả: {product.author}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-indigo-700">
                          {product.category?.name || "Khác"}
                        </TableCell>
                        <TableCell className="font-semibold text-indigo-900">
                          {product.price.toLocaleString("vi-VN")}₫
                        </TableCell>
                        <TableCell className={product.stock === 0 ? "text-red-500" : "text-green-600"}>
                          {product.stock === 0 ? "Hết hàng" : `${product.stock} cuốn`}
                        </TableCell>
                        <TableCell>{product.publishYear}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-indigo-950 text-lg mb-4">Không tìm thấy sản phẩm nào</p>
              <Button onClick={handleClearFilters} variant="outline">
                Xóa bộ lọc
              </Button>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {paginationItems.map((item, index) => {
                  if (item === "...") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        onClick={() => setCurrentPage(item as number)}
                        isActive={currentPage === item}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
    </div>
  )
}
