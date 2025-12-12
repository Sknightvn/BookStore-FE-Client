"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, User, ArrowRight, BookOpen, TrendingUp, Star } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: string
  tags: string[]
  readTime: number
  image: string
  featured?: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Cuốn Sách Kinh Doanh Hay Nhất Năm 2024",
    excerpt: "Khám phá những cuốn sách kinh doanh được đánh giá cao nhất trong năm, từ chiến lược đến lãnh đạo.",
    content: "Nội dung chi tiết về các cuốn sách kinh doanh...",
    author: "Nguyễn Văn A",
    publishDate: "2024-01-15",
    category: "Kinh doanh",
    tags: ["kinh doanh", "sách hay", "2024"],
    readTime: 8,
    image: "/business-books.png",
    featured: true,
  },
  {
    id: "2",
    title: "Cách Xây Dựng Thói Quen Đọc Sách Hiệu Quả",
    excerpt: "Hướng dẫn chi tiết để phát triển thói quen đọc sách bền vững và hiệu quả cho cuộc sống.",
    content: "Nội dung chi tiết về cách xây dựng thói quen đọc sách...",
    author: "Trần Thị B",
    publishDate: "2024-01-10",
    category: "Kỹ năng sống",
    tags: ["đọc sách", "thói quen", "phát triển bản thân"],
    readTime: 6,
    image: "/diverse-reading-habits.png",
  },
  {
    id: "3",
    title: "Review: Sapiens - Cuốn Sách Thay Đổi Cách Nhìn Về Lịch Sử",
    excerpt: "Đánh giá chi tiết về cuốn sách Sapiens của Yuval Noah Harari và tác động của nó đến độc giả.",
    content: "Nội dung review chi tiết về Sapiens...",
    author: "Lê Văn C",
    publishDate: "2024-01-05",
    category: "Review sách",
    tags: ["sapiens", "lịch sử", "review"],
    readTime: 10,
    image: "/sapiens-book-cover.png",
    featured: true,
  },
  {
    id: "4",
    title: "Xu Hướng Đọc Sách Điện Tử Trong Thời Đại Số",
    excerpt: "Phân tích xu hướng đọc sách điện tử và những thay đổi trong thói quen đọc của người Việt.",
    content: "Nội dung về xu hướng đọc sách điện tử...",
    author: "Phạm Thị D",
    publishDate: "2024-01-01",
    category: "Công nghệ",
    tags: ["sách điện tử", "công nghệ", "xu hướng"],
    readTime: 7,
    image: "/digital-reading.png",
  },
  {
    id: "5",
    title: "Top 5 Tác Giả Việt Nam Được Yêu Thích Nhất",
    excerpt: "Điểm qua những tác giả Việt Nam có tác phẩm được độc giả yêu thích và tìm đọc nhiều nhất.",
    content: "Nội dung về các tác giả Việt Nam...",
    author: "Hoàng Văn E",
    publishDate: "2023-12-28",
    category: "Văn học Việt",
    tags: ["tác giả việt", "văn học", "top 5"],
    readTime: 9,
    image: "/vietnamese-authors.png",
  },
  {
    id: "6",
    title: "Cách Chọn Sách Phù Hợp Với Từng Độ Tuổi",
    excerpt: "Hướng dẫn phụ huynh cách lựa chọn sách phù hợp cho con em mình ở từng giai đoạn phát triển.",
    content: "Nội dung về cách chọn sách theo độ tuổi...",
    author: "Nguyễn Thị F",
    publishDate: "2023-12-25",
    category: "Giáo dục",
    tags: ["chọn sách", "trẻ em", "giáo dục"],
    readTime: 5,
    image: "/colorful-childrens-books.png",
  },
]

const categories = ["Tất cả", "Kinh doanh", "Kỹ năng sống", "Review sách", "Công nghệ", "Văn học Việt", "Giáo dục"]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog BookStore</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Khám phá thế giới sách qua những bài viết chất lượng về xu hướng đọc, review sách hay và mẹo đọc hiệu quả
        </p>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            Bài viết nổi bật
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">Nổi bật</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.publishDate).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </span>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.readTime} phút đọc</span>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Đọc tiếp
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="hover:scale-105 transition-transform duration-200"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="relative overflow-hidden">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 left-3 bg-blue-500 hover:bg-blue-600">{post.category}</Badge>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.publishDate).toLocaleDateString("vi-VN")}
                </span>
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {post.author}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm text-gray-500 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {post.readTime} phút đọc
                </span>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium hover:scale-105 transition-transform duration-200"
                >
                  Đọc tiếp
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy bài viết</h3>
          <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
        </div>
      )}

      {/* Newsletter Signup */}
      <Card className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <CardContent className="p-8 text-center">
          <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Đăng ký nhận tin tức</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nhận thông báo về những bài viết mới nhất, review sách hay và các chương trình khuyến mãi đặc biệt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Nhập email của bạn" className="flex-1" />
            <Button className="bg-blue-600 hover:bg-blue-700">Đăng ký</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
