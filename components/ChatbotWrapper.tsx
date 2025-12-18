"use client";

import { ChatbotWidgetComponent } from "./ChatbotWidget";
import { useAuth } from "@/contexts/auth-context";

export default function ChatbotWrapper() {
  const { user } = useAuth();
  
  return <ChatbotWidgetComponent userId={user?.id} />;
}

