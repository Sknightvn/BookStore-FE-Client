// Request Interfaces
export interface ChatRequest {
  message: string;
  userId?: string;
}

export interface RecommendRequest {
  query: string;
  userId?: string;
  limit?: number;
}

export interface GuideRequest {
  purpose: string;
  level?: string;
  interests?: string;
  userId?: string;
}

export interface CompareRequest {
  bookIds: string[];
  aspects?: string[];
}

export interface SimilarRequest {
  bookId: string;
  limit?: number;
}

export interface ReviewRequest {
  bookId: string;
}

export interface SummarizeRequest {
  bookId: string;
  length?: "short" | "medium" | "long";
}

export interface BookQARequest {
  bookId: string;
  question: string;
}

// Response Interfaces
export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    model: string;
  };
}

export interface RecommendResponse {
  success: boolean;
  data: {
    books: Book[];
    query: string;
    count: number;
  };
}

export interface GuideResponse {
  success: boolean;
  data: {
    guide: string;
    purpose: string;
    level?: string;
    interests?: string;
  };
}

export interface CompareResponse {
  success: boolean;
  data: {
    comparison: string;
    recommendation: string;
    books: Book[];
  };
}

export interface SimilarResponse {
  success: boolean;
  data: {
    originalBook: Book;
    similarBooks: Book[];
    reason: string;
  };
}

export interface ReviewResponse {
  success: boolean;
  data: {
    book: Book;
    review: {
      summary: string;
      strengths: string[];
      weaknesses: string[];
      targetAudience: string;
      rating: number;
    };
  };
}

export interface SummarizeResponse {
  success: boolean;
  data: {
    book: Book;
    summary: string;
    keyPoints: string[];
  };
}

export interface BookQAResponse {
  success: boolean;
  data: {
    book: Book;
    question: string;
    answer: string;
  };
}

// Book Interface
export interface Book {
  _id: string;
  title: string;
  author: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  description?: string;
  publishYear?: number;
  pages?: number;
  coverImage?: string;
  stock?: number;
  volume?: string;
}

// Message Interface cho ChatBotWidget
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

