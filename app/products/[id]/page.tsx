"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  IconArrowLeft,
  IconShoppingCart,
  IconMinus,
  IconPlus,
  IconCategory2,
  IconBarcode,
  IconCalendar,
  IconBook2,
  IconLayersSubtract,
  IconBuildingWarehouse,
  IconUserSquareRounded,
  IconStar,
  IconTruck,
  IconRefresh,
  IconHeartHandshake,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandX,
  IconShare3,
  IconBrandBooking,
  IconLibrary,
  IconMessageCircle,
  IconUser,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"
import { useParams } from "next/navigation"
import { useBook, useBooks, useAddReview } from "@/hooks/useBooks"
import ProductCard, { FeaturedProductCard } from "@/components/product-card"
import { useAuth } from "@/contexts/auth-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { data: productData, isLoading: loading } = useBook(productId)
  const product = productData?.data || null
  const { user, isAuthenticated } = useAuth()
  const addReviewMutation = useAddReview()

  const { data: booksData } = useBooks()
  const allBooks = booksData?.data || []
  const similarBooks = allBooks
    .filter(
      (b) =>
        b._id !== product?._id &&
        b.category?._id &&
        product?.category?._id &&
        b.category._id === product.category._id,
    )
    .slice(0, 4)

  const [quantity, setQuantity] = useState(1)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (!product) return

    if (quantity > product.stock) {
      return message.error("Số lượng vượt quá hàng tồn kho!")
    }

    addToCart(
      {
        id: product._id,
        title: product.title,
        price: product.price,
        coverImage: product.coverImage,
        volume: product.volume || ""
      },
      quantity
    )

    message.success(`Đã thêm ${quantity} cuốn "${product.title}" vào giỏ hàng!`)
    setQuantity(1)
  }

  const handleQuantityChange = (value: number) => {
    if (product) {
      const newQuantity = Math.max(1, Math.min(value, product.stock))
      setQuantity(newQuantity)
    }
  }

  const handleSubmitReview = async () => {
    if (!isAuthenticated() || !user) {
      message.warning("Vui lòng đăng nhập để đánh giá sản phẩm")
      return
    }

    if (!reviewText.trim()) {
      message.warning("Vui lòng nhập nội dung đánh giá")
      return
    }

    if (reviewRating < 1 || reviewRating > 5) {
      message.warning("Vui lòng chọn số sao từ 1 đến 5")
      return
    }

    try {
      await addReviewMutation.mutateAsync({
        bookId: productId,
        rating: reviewRating,
        review: reviewText.trim(),
      })
      message.success("Đã thêm đánh giá thành công!")
      setReviewText("")
      setReviewRating(5)
      setShowReviewForm(false)
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm đánh giá")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number, size: number = 18) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <IconStar
        key={index}
        size={size}
        className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-indigo-950 font-medium">Đang tải chi tiết sách...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-indigo-950 text-lg mb-4">Không tìm thấy sản phẩm</p>
          <Button asChild variant="outline">
            <Link href="/products">
              <IconArrowLeft size={16} className="mr-2" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-8">
      {/* Breadcrumb + Back */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Danh mục sách</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex items-start justify-center relative h-full">
        <Image src={product.coverImage || "/placeholder.svg"} alt={product.title} fill className="object-contain w-full h-full" />
        </div>

        {/* Product Details */}
        <div className="space-y-4 rounded-xl border border-indigo-100 bg-white/80 p-4 shadow-sm">
          <div>
            <h1 className="text-3xl font-semibold text-indigo-950 mb-1 line-clamp-2">{product.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(product.averageRating || 0))}
                </div>
                {product.averageRating && (
                  <span className="text-sm font-medium text-indigo-950">
                    {product.averageRating.toFixed(1)}
                  </span>
                )}
                {product.totalReviews !== undefined && (
                  <span className="text-sm text-gray-500">
                    ({product.totalReviews} đánh giá)
                  </span>
                )}
              </div>
              <p className="flex items-center gap-2 text-sm font-semibold text-indigo-700 border border-indigo-500 rounded-full px-3 bg-indigo-50">
                <IconUserSquareRounded size={16} className="text-indigo-500" />
                <span>{product.author}</span>
              </p>
              {!isOutOfStock && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-3 text-xs font-medium text-green-700 border border-green-500 h-fit py-1">
                  Còn {product.stock} cuốn
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex gap-4 items-baseline">
            <div>
              <p className="text-4xl font-semibold text-indigo-600">
                {product.price.toLocaleString("vi-VN")}₫
              </p>
            </div>

          </div>

          {/* Product Info */}
          <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="flex items-center space-x-2">
                <IconBrandBooking size={20} className="text-indigo-700" />
                <span className="text-lg text-indigo-700">Thông tin sách</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconCategory2 size={16} className="text-indigo-500" />
                  Danh mục:
                </span>
                <span className="font-medium">{product.category?.name || "Khác"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconBarcode size={16} className="text-indigo-500" />
                  Mã ISBN:
                </span>
                <span className="font-medium">{product.ISSN}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconCalendar size={16} className="text-indigo-500" />
                  Năm xuất bản:
                </span>
                <span className="font-medium">{product.publishYear}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconBook2 size={16} className="text-indigo-500" />
                  Số trang:
                </span>
                <span className="font-medium">{product.pages}</span>
              </div>
              {product.volume && (
                <div className="flex items-center justify-between">
                  <span className="text-indigo-950 flex items-center gap-2">
                    <IconLayersSubtract size={16} className="text-indigo-500" />
                    Tập:
                  </span>
                  <span className="font-medium">{product.volume}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-indigo-950 flex items-center gap-2">
                  <IconBuildingWarehouse size={16} className="text-indigo-500" />
                  Kho hàng:
                </span>
                <span className={`font-medium ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
                  {isOutOfStock ? "Hết hàng" : `${product.stock} cuốn`}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <Card className="border border-indigo-300 bg-slate-50/80 overflow-hidden">
              <CardHeader className="bg-indigo-100">
                <CardTitle className="flex items-center space-x-2">
                  <IconLibrary size={20} className="text-indigo-700" />
                  <span className="text-lg text-indigo-700">Mô tả</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-950 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-indigo-950 font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3"
                >
                  <IconMinus size={16} />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  disabled={isOutOfStock}
                  className="w-12 text-center border-0 outline-none"
                  min="1"
                  max={product.stock}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3"
                >
                  <IconPlus size={16} />
                </Button>
              </div>
            </div>

            <Button
              variant="fulled"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              size="lg"
              className="w-full"
            >
              <IconShoppingCart size={20} className="mr-1" />
              {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </Button>

            {/* Services / Benefits */}
            <div className="flex flex-col gap-3 pt-2 border-t border-indigo-100 mt-2">
              {[
                {
                  icon: IconTruck,
                  title: "Miễn phí vận chuyển",
                  description: "Cho đơn hàng từ 300.000₫",
                },
                {
                  icon: IconHeartHandshake,
                  title: "Nhấn và sưu tầm",
                  description: "Thêm vào bộ sưu tập yêu thích",
                },
                {
                  icon: IconRefresh,
                  title: "Hoàn trả dễ dàng",
                  description: "Đổi trả trong 7 ngày",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-2 bg-indigo-50 p-3 rounded-lg">
                  <Icon size={24} className="mt-0.5 text-indigo-500" />
                  <div>
                    <p className="text-base font-semibold text-indigo-900">{title}</p>
                    <p className="text-sm text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share section */}
            <div className="pt-4 border-t border-indigo-100">
              <p className="text-base font-medium text-indigo-900 mb-2">Chia sẻ:</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-[#1877f2] hover:bg-[#1453a8] text-white"
                  aria-label="Chia sẻ lên Facebook"
                >
                  <IconBrandFacebook size={18} className="text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gradient-to-tr from-[#feda75] via-[#e1306c] to-[#4f5bd5] text-white"
                  aria-label="Chia sẻ lên Instagram"
                >
                  <IconBrandInstagram size={18} className="text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-slate-900 hover:bg-black text-white"
                  aria-label="Chia sẻ lên X"
                >
                  <IconBrandX size={18} className="text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"
                  aria-label="Sao chép / chia sẻ liên kết"
                >
                  <IconShare3 size={18} className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-2">
            <span className="text-indigo-950 bg-indigo-800 w-1.5 h-5 rounded-full inline-block mr-2 translate-y-0.5"></span>
            <span>Đánh giá sản phẩm</span>
          </h2>
          {isAuthenticated() && (
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center gap-2"
            >
              <IconMessageCircle size={18} />
              {showReviewForm ? "Ẩn form đánh giá" : "Viết đánh giá"}
            </Button>
          )}
        </div>

        {/* Review Form */}
        {isAuthenticated() && showReviewForm && (
          <Card className="border border-indigo-300 bg-slate-50/80">
            <CardHeader className="bg-indigo-100">
              <CardTitle className="flex items-center space-x-2">
                <IconMessageCircle size={20} className="text-indigo-700" />
                <span className="text-lg text-indigo-700">Viết đánh giá của bạn</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="text-indigo-950 font-medium">Đánh giá sao:</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <IconStar
                        size={32}
                        className={
                          star <= reviewRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-indigo-950">
                    {reviewRating} / 5 sao
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-text" className="text-indigo-950 font-medium">
                  Nội dung đánh giá:
                </Label>
                <Textarea
                  id="review-text"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={addReviewMutation.isPending}
                  className="flex-1"
                >
                  {addReviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false)
                    setReviewText("")
                    setReviewRating(5)
                  }}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isAuthenticated() && (
          <Card className="border border-indigo-300 bg-slate-50/80">
            <CardContent className="py-6 text-center">
              <p className="text-indigo-950 mb-4">Đăng nhập để viết đánh giá sản phẩm</p>
              <Button asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <Card key={review._id} className="border border-indigo-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {review.userId?.avatar ? (
                        <Image
                          src={review.userId.avatar}
                          alt={review.userId?.name || "Người dùng"}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                          <IconUser size={24} className="text-indigo-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-indigo-950">
                            {review.userId?.name || "Người dùng ẩn danh"}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating, 16)}
                        </div>
                      </div>
                      <p className="text-indigo-950 leading-relaxed">{review.review}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-indigo-200 bg-white">
            <CardContent className="py-8 text-center">
              <IconMessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-indigo-950">Chưa có đánh giá nào cho sản phẩm này</p>
              <p className="text-sm text-gray-500 mt-2">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Similar products */}
      {similarBooks.length > 0 && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-2">
              <span className="text-indigo-950 bg-indigo-800 w-1.5 h-5 rounded-full inline-block mr-2 translate-y-0.5"></span>
              <span>Sản phẩm tương tự</span>
            </h2>
            <Link href="/products" className="text-sm text-indigo-600 hover:text-indigo-700 underline">
              Xem thêm
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarBooks.map((book) => (
              <FeaturedProductCard key={book._id} product={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
