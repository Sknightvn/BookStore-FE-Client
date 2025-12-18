"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatBotWidget } from "chatbot-widget-ui";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatMessage } from "@/interface/chatbot.interface";
import { IconMessageCircle, IconRobot } from "@tabler/icons-react";

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

interface ChatbotWidgetProps {
  userId?: string;
  primaryColor?: string;
  chatbotName?: string;
}

export const ChatbotWidgetComponent = ({
  userId,
  primaryColor = "#6366F1",
  chatbotName = "Chat với kt.bookstore AI",
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
        // Format markdown thành HTML
        const formattedResponse = formatMarkdownToHTML(response);
        return formattedResponse;
      } catch (error) {
        throw error;
      }
    },
    [sendMessage]
  );

  const handleBotResponse = useCallback((response: string) => {
    console.log("Bot Response:", response);
  }, []);

  const handleNewMessage = useCallback((message: any) => {
    console.log("New Message:", message);
  }, []);

  return (
    <div style={{ zIndex: 9999, position: "relative" }}>
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
          <IconMessageCircle size={24} style={{ color: "currentColor" }} />
        }
        botIcon={
          <IconRobot 
            size={20} 
            style={{ 
              color: "currentColor",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }} 
          />
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
    </div>
  );
};

