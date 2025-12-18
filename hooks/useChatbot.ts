import { useState, useCallback, useEffect } from "react";
import { chatApi } from "@/api/chatbot";
import { ChatRequest, ChatMessage } from "@/interface/chatbot.interface";

// Helper function để format markdown text thành HTML
const formatMarkdownToHTML = (text: string): string => {
  if (!text) return "";
  
  let formatted = text;
  
  // Escape HTML để tránh XSS (trước khi convert markdown)
  formatted = formatted
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Convert **text** thành <strong>text</strong> (bold)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Split by lines để xử lý từng dòng
  const lines = formatted.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      // Empty line -> add break
      if (processedLines.length > 0 && !processedLines[processedLines.length - 1].endsWith('<br>')) {
        processedLines.push('<br>');
      }
      continue;
    }
    
    // Nếu dòng bắt đầu bằng số thứ tự (1. 2. 3.)
    if (/^\d+\.\s/.test(line)) {
      if (processedLines.length > 0) {
        processedLines.push('<br>');
      }
      processedLines.push(line);
    } else {
      processedLines.push(line);
    }
  }
  
  formatted = processedLines.join('<br>');
  
  // Clean up: remove leading <br>
  formatted = formatted.replace(/^<br>+/, "");
  
  // Clean up: remove multiple consecutive <br> (max 2)
  formatted = formatted.replace(/(<br>\s*){3,}/g, "<br><br>");
  
  return formatted;
};

interface UseChatbotOptions {
  userId?: string;
  onError?: (error: Error) => void;
  enableHistory?: boolean; // Enable/disable lưu lịch sử
}

export const useChatbot = (options?: UseChatbotOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const storageKey = `chatbot_messages_${options?.userId || "guest"}`;
  const enableHistory = options?.enableHistory !== false; // Default: true

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
          // Format markdown thành HTML cho bot message
          const formattedContent = formatMarkdownToHTML(response.data.message);
          const botMessage: ChatMessage = {
            role: "assistant",
            content: formattedContent,
          };
          setMessages((prev) => [...prev, botMessage]);
          return formattedContent;
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

        // Thêm message lỗi vào chat (không format vì là error message)
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

  // Load messages từ localStorage khi mount
  useEffect(() => {
    if (!enableHistory) return;
    
    try {
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Format lại các bot messages khi load từ localStorage
          const formattedMessages = parsed.map((msg: ChatMessage) => {
            if (msg.role === "assistant" && msg.content && !msg.content.includes('<strong>') && !msg.content.includes('<br>')) {
              // Nếu chưa được format (không có HTML tags), format lại
              return {
                ...msg,
                content: formatMarkdownToHTML(msg.content),
              };
            }
            return msg;
          });
          setMessages(formattedMessages);
        }
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
  }, [storageKey, enableHistory]);

  // Lưu messages vào localStorage khi messages thay đổi
  useEffect(() => {
    if (!enableHistory) return;
    
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (e) {
        console.error("Error saving chat history:", e);
      }
    } else {
      // Xóa lịch sử nếu messages rỗng
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.error("Error clearing chat history:", e);
      }
    }
  }, [messages, storageKey, enableHistory]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (enableHistory) {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.error("Error clearing chat history:", e);
      }
    }
  }, [storageKey, enableHistory]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};

