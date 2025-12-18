"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatBotWidget } from "chatbot-widget-ui";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatMessage } from "@/interface/chatbot.interface";

interface ChatbotWidgetProps {
  userId?: string;
  primaryColor?: string;
  chatbotName?: string;
}

export const ChatbotWidgetComponent = ({
  userId,
  primaryColor = "#6366F1",
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

  const handleNewMessage = useCallback((message: any) => {
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

