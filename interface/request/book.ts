export interface GetBookRequest {
    id: string
}

export interface BookFilters {
    category?: string
    search?: string
    sortBy?: string
}

export interface AddReviewRequest {
    bookId: string
    rating: number
    review: string
}