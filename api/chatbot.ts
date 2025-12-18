import axiosInstance from "@/lib/axios";
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
} from "@/interface/chatbot.interface";

// 1. Chat tổng quát - hỏi đáp và gợi ý
export const chatApi = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await axiosInstance.post<ChatResponse>("/chatbot/chat", data);
  return response.data;
};

// 2. Gợi ý sách thông minh
export const recommendApi = async (data: RecommendRequest): Promise<RecommendResponse> => {
  const response = await axiosInstance.post<RecommendResponse>("/chatbot/recommend", data);
  return response.data;
};

// 3. Định hướng đọc sách
export const guideApi = async (data: GuideRequest): Promise<GuideResponse> => {
  const response = await axiosInstance.post<GuideResponse>("/chatbot/guide", data);
  return response.data;
};

// 4. So sánh sách
export const compareApi = async (data: CompareRequest): Promise<CompareResponse> => {
  const response = await axiosInstance.post<CompareResponse>("/chatbot/compare", data);
  return response.data;
};

// 5. Tìm sách tương tự
export const similarApi = async (data: SimilarRequest): Promise<SimilarResponse> => {
  const response = await axiosInstance.post<SimilarResponse>("/chatbot/similar", data);
  return response.data;
};

// 6. Đánh giá sách
export const reviewApi = async (data: ReviewRequest): Promise<ReviewResponse> => {
  const response = await axiosInstance.post<ReviewResponse>("/chatbot/review", data);
  return response.data;
};

// 7. Tóm tắt sách
export const summarizeApi = async (data: SummarizeRequest): Promise<SummarizeResponse> => {
  const response = await axiosInstance.post<SummarizeResponse>("/chatbot/summarize", data);
  return response.data;
};

// 8. Hỏi về sách cụ thể
export const bookQAApi = async (data: BookQARequest): Promise<BookQAResponse> => {
  const response = await axiosInstance.post<BookQAResponse>("/chatbot/book-qa", data);
  return response.data;
};

