import { useState, useCallback } from "react";
import { chatApi } from "@/api/chatbot";
import { ChatRequest, ChatMessage } from "@/interface/chatbot.interface";

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

