export interface Category {
    _id: string
    name: string
}

export interface Review {
    _id: string
    userId: {
        _id: string
        name: string
        email: string
        avatar?: string
    }
    rating: number
    review: string
    createdAt: string
    updatedAt: string
}

export interface Book {
    _id: string
    title: string
    author: string
    ISSN: string
    category: Category
    price: number
    stock: number
    publishYear: number
    pages: number
    coverImage: string
    description: string
    volume?: string
    reviews?: Review[]
    averageRating?: number
    totalReviews?: number
}

export interface BooksResponse {
    success: boolean
    data: Book[]
    message?: string
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface BookResponse {
    success: boolean
    data: Book
    message?: string
}

export interface TopProduct {
    productId: string
    _id?: string
    title: string
    author?: string
    category: string
    image?: string
    coverImage?: string
    ISSN?: string
    totalQuantity: number
    totalRevenue: number
    price?: number
    stock?: number
    volume?: string
}

export interface TopProductsResponse {
    success: boolean
    data: TopProduct[]
    message?: string
}
