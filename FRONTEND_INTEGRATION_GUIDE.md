# 💻 Hướng Dẫn Tích Hợp Chatbot Widget vào Next.js

## 📦 Bước 1: Cài Đặt Package

```bash
npm install chatbot-widget-ui@latest
```

## 📁 Bước 2: Tạo Cấu Trúc File

### 2.1. Interfaces (`src/interfaces/chatbot.interface.ts`)

```typescript
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
```

### 2.2. API Service (`src/api/chatbot.api.ts`)

```typescript
import axios from "axios";
import {
  ChatRequest,
  ChatResponse,
  RecommendRequest,
  RecommendResponse,
  GuideRequest,
  GuideResponse,
  CompareRequest,
  CompareResponse,
  SimilarRequest,
  SimilarResponse,
  ReviewRequest,
  ReviewResponse,
  SummarizeRequest,
  SummarizeResponse,
  BookQARequest,
  BookQAResponse,
} from "@/interfaces/chatbot.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const chatbotApi = axios.create({
  baseURL: `${API_BASE_URL}/chatbot`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Chat tổng quát - hỏi đáp và gợi ý
export const chatApi = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await chatbotApi.post<ChatResponse>("/chat", data);
  return response.data;
};

// 2. Gợi ý sách thông minh
export const recommendApi = async (data: RecommendRequest): Promise<RecommendResponse> => {
  const response = await chatbotApi.post<RecommendResponse>("/recommend", data);
  return response.data;
};

// 3. Định hướng đọc sách
export const guideApi = async (data: GuideRequest): Promise<GuideResponse> => {
  const response = await chatbotApi.post<GuideResponse>("/guide", data);
  return response.data;
};

// 4. So sánh sách
export const compareApi = async (data: CompareRequest): Promise<CompareResponse> => {
  const response = await chatbotApi.post<CompareResponse>("/compare", data);
  return response.data;
};

// 5. Tìm sách tương tự
export const similarApi = async (data: SimilarRequest): Promise<SimilarResponse> => {
  const response = await chatbotApi.post<SimilarResponse>("/similar", data);
  return response.data;
};

// 6. Đánh giá sách
export const reviewApi = async (data: ReviewRequest): Promise<ReviewResponse> => {
  const response = await chatbotApi.post<ReviewResponse>("/review", data);
  return response.data;
};

// 7. Tóm tắt sách
export const summarizeApi = async (data: SummarizeRequest): Promise<SummarizeResponse> => {
  const response = await chatbotApi.post<SummarizeResponse>("/summarize", data);
  return response.data;
};

// 8. Hỏi về sách cụ thể
export const bookQAApi = async (data: BookQARequest): Promise<BookQAResponse> => {
  const response = await chatbotApi.post<BookQAResponse>("/book-qa", data);
  return response.data;
};
```

### 2.3. Custom Hook (`src/hooks/useChatbot.ts`)

```typescript
import { useState, useCallback } from "react";
import { chatApi } from "@/api/chatbot.api";
import { ChatRequest, ChatMessage } from "@/interfaces/chatbot.interface";

interface UseChatbotOptions {
  userId?: string;
  onError?: (error: Error) => void;
}

export const useChatbot = (options?: UseChatbotOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (message: string): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        // Thêm message của user vào state
        const userMessage: ChatMessage = {
          role: "user",
          content: message,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Gọi API
        const request: ChatRequest = {
          message,
          userId: options?.userId,
        };

        const response = await chatApi(request);

        if (response.success) {
          const botMessage: ChatMessage = {
            role: "assistant",
            content: response.data.message,
          };
          setMessages((prev) => [...prev, botMessage]);
          return response.data.message;
        } else {
          throw new Error("API response không thành công");
        }
      } catch (err: any) {
        let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";

        if (err.response) {
          switch (err.response.status) {
            case 429:
              errorMessage = "Quá nhiều requests. Vui lòng đợi một chút.";
              break;
            case 401:
              errorMessage = "Lỗi xác thực. Vui lòng đăng nhập lại.";
              break;
            case 500:
              errorMessage = "Lỗi server. Vui lòng thử lại sau.";
              break;
            default:
              errorMessage = err.response.data?.message || errorMessage;
          }
        } else if (err.request) {
          errorMessage = "Không thể kết nối đến server. Kiểm tra kết nối mạng.";
        }

        const error = new Error(errorMessage);
        setError(error);

        // Thêm message lỗi vào chat
        const errorMessageObj: ChatMessage = {
          role: "assistant",
          content: errorMessage,
        };
        setMessages((prev) => [...prev, errorMessageObj]);

        if (options?.onError) {
          options.onError(error);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options?.userId, options?.onError]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
```

### 2.4. Chatbot Widget Component (`src/components/ChatbotWidget.tsx`)

```typescript
"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatBotWidget } from "chatbot-widget-ui";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatMessage } from "@/interfaces/chatbot.interface";

interface ChatbotWidgetProps {
  userId?: string;
  primaryColor?: string;
  chatbotName?: string;
}

export const ChatbotWidgetComponent = ({
  userId,
  primaryColor = "#3498db",
  chatbotName = "Trợ lý Sách",
}: ChatbotWidgetProps) => {
  const { messages, isLoading, sendMessage } = useChatbot({
    userId,
    onError: (error) => {
      console.error("Chatbot error:", error);
    },
  });

  // Load messages từ localStorage khi mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatbot_messages_${userId || "guest"}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Không set trực tiếp, để useChatbot quản lý
      } catch (e) {
        console.error("Error loading messages:", e);
      }
    }
  }, [userId]);

  // Lưu messages vào localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatbot_messages_${userId || "guest"}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  const customApiCall = useCallback(
    async (message: string): Promise<string> => {
      try {
        const response = await sendMessage(message);
        return response;
      } catch (error) {
        throw error;
      }
    },
    [sendMessage]
  );

  const handleBotResponse = useCallback((response: string) => {
    console.log("Bot Response:", response);
  }, []);

  const handleNewMessage = useCallback((message: ChatMessage) => {
    console.log("New Message:", message);
  }, []);

  return (
    <ChatBotWidget
      callApi={customApiCall}
      onBotResponse={handleBotResponse}
      handleNewMessage={handleNewMessage}
      messages={messages}
      primaryColor={primaryColor}
      inputMsgPlaceholder="Nhập câu hỏi của bạn..."
      chatbotName={chatbotName}
      isTypingMessage="Đang suy nghĩ..."
      IncommingErrMsg="Xin lỗi, có lỗi xảy ra. Vui lòng thử lại."
      chatIcon={
        <div style={{ fontSize: "24px" }}>💬</div>
      }
      botIcon={
        <div style={{ fontSize: "20px" }}>🤖</div>
      }
      botFontStyle={{
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        color: "#333",
      }}
      typingFontStyle={{
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        color: "#888",
        fontStyle: "italic",
      }}
      useInnerHTML={true}
    />
  );
};
```

### 2.5. Sử Dụng Trong Layout (`app/layout.tsx`)

```typescript
import { ChatbotWidgetComponent } from "@/components/ChatbotWidget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Lấy userId từ auth context của bạn
  // const { user } = useAuth();
  
  return (
    <html lang="vi">
      <body>
        {children}
        {/* Chatbot hiển thị trên mọi trang */}
        <ChatbotWidgetComponent userId={undefined} />
      </body>
    </html>
  );
}
```

### 2.6. Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📚 3. Ví Dụ Sử Dụng Các API Khác

### 3.1. Định Hướng Đọc Sách

```typescript
import { guideApi } from "@/api/chatbot.api";

const handleGetGuide = async () => {
  try {
    const response = await guideApi({
      purpose: "Học lập trình web",
      level: "Người mới bắt đầu",
      interests: "JavaScript, React",
      userId: user?.id,
    });
    console.log("Guide:", response.data.guide);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 3.2. So Sánh Sách

```typescript
import { compareApi } from "@/api/chatbot.api";

const handleCompareBooks = async (bookIds: string[]) => {
  try {
    const response = await compareApi({
      bookIds: bookIds,
      aspects: ["price", "content", "difficulty"], // optional
    });
    console.log("Comparison:", response.data.comparison);
    console.log("Recommendation:", response.data.recommendation);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 3.3. Tìm Sách Tương Tự

```typescript
import { similarApi } from "@/api/chatbot.api";

const handleFindSimilar = async (bookId: string) => {
  try {
    const response = await similarApi({
      bookId: bookId,
      limit: 5,
    });
    console.log("Similar books:", response.data.similarBooks);
    console.log("Reason:", response.data.reason);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 3.4. Đánh Giá Sách

```typescript
import { reviewApi } from "@/api/chatbot.api";

const handleReviewBook = async (bookId: string) => {
  try {
    const response = await reviewApi({ bookId });
    console.log("Review:", response.data.review);
    console.log("Rating:", response.data.review.rating);
    console.log("Strengths:", response.data.review.strengths);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 3.5. Tóm Tắt Sách

```typescript
import { summarizeApi } from "@/api/chatbot.api";

const handleSummarize = async (bookId: string) => {
  try {
    const response = await summarizeApi({
      bookId: bookId,
      length: "medium", // "short" | "medium" | "long"
    });
    console.log("Summary:", response.data.summary);
    console.log("Key Points:", response.data.keyPoints);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 3.6. Hỏi Về Sách Cụ Thể

```typescript
import { bookQAApi } from "@/api/chatbot.api";

const handleBookQA = async (bookId: string, question: string) => {
  try {
    const response = await bookQAApi({
      bookId: bookId,
      question: question,
    });
    console.log("Answer:", response.data.answer);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

## ✅ Checklist

- [ ] Cài đặt `chatbot-widget-ui`
- [ ] Tạo file interfaces (đầy đủ 8 API)
- [ ] Tạo file API service (đầy đủ 8 API)
- [ ] Tạo custom hook
- [ ] Tạo component wrapper
- [ ] Thêm env variable
- [ ] Tích hợp vào layout
- [ ] Test gửi tin nhắn (chat)
- [ ] Test các API khác (recommend, guide, compare, similar, review, summarize, book-qa)

## 🎨 Customization

Bạn có thể tùy chỉnh màu sắc, font, icons trong `ChatbotWidget.tsx`:

```typescript
<ChatBotWidget
  primaryColor="#your-color"
  chatbotName="Tên Chatbot"
  botFontStyle={{ fontFamily: "Arial", fontSize: "14px" }}
  // ... các props khác
/>
```

## 📋 Tóm Tắt 8 API Endpoints

| # | Endpoint | Method | Mô Tả |
|---|----------|--------|-------|
| 1 | `/api/chatbot/chat` | POST | Chat tổng quát - hỏi đáp và gợi ý |
| 2 | `/api/chatbot/recommend` | POST | Gợi ý sách thông minh |
| 3 | `/api/chatbot/guide` | POST | Định hướng đọc sách |
| 4 | `/api/chatbot/compare` | POST | So sánh sách (2-3 cuốn) |
| 5 | `/api/chatbot/similar` | POST | Tìm sách tương tự |
| 6 | `/api/chatbot/review` | POST | Đánh giá sách |
| 7 | `/api/chatbot/summarize` | POST | Tóm tắt sách |
| 8 | `/api/chatbot/book-qa` | POST | Hỏi về sách cụ thể |

