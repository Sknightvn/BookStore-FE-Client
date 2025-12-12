export interface Category {
    _id: string
    name: string
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
}

export interface BooksResponse {
    success: boolean
    data: Book[]
    message?: string
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
