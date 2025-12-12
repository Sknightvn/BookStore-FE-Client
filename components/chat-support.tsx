"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Send, User, Bot } from "lucide-react"

interface ChatMessage {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

// ==== BOT LOGIC ====
const includesAny = (text: string, keywords: string[]) => {
  return keywords.some((k) => text.includes(k))
}

const getBotResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase().trim()

  if (includesAny(lowerMessage, ["giá", "tiền", "bao nhiêu", "đắt", "rẻ"])) {
    return "Bạn có thể xem giá chi tiết trên từng trang sản phẩm. KT.BookStore thường xuyên có khuyến mãi, bạn nhớ để ý mục 'Khuyến mãi' trong giỏ hàng khi thêm sản phẩm vào nhé!"
  }

  if (includesAny(lowerMessage, ["giao hàng", "ship", "vận chuyển", "phí ship"])) {
    return "KT.BookStore giao hàng toàn quốc. Thời gian giao từ 2-5 ngày tuỳ khu vực, phí ship được tính tự động ở bước thanh toán."
  }

  if (includesAny(lowerMessage, ["thanh toán", "chuyển khoản", "cod"])) {
    return "Hiện KT.BookStore hỗ trợ: \n- Thanh toán khi nhận hàng (COD)\n- Chuyển khoản ngân hàng."
  }

  if (includesAny(lowerMessage, ["đổi trả", "hoàn trả", "hoàn tiền", "bị lỗi", "bị hỏng"])) {
    return "KT.BookStore hỗ trợ đổi trả trong 7 ngày kể từ khi nhận hàng nếu sản phẩm bị lỗi từ nhà sản xuất hoặc giao nhầm. Bạn giữ lại hoá đơn và tình trạng sách còn tương đối nguyên nhé."
  }

  if (includesAny(lowerMessage, ["tư vấn sách", "gợi ý sách", "recommend", "nên đọc gì", "sách hay"])) {
    return "Bạn có thể cho mình biết thêm: bạn thích thể loại nào (ví dụ: kỹ năng sống, thiếu nhi, kinh tế, tiểu thuyết, manga,...)? Hiện tại bạn có thể xem mục 'Sách nổi bật' và 'Bảng xếp hạng sách bán chạy' trên trang chủ để tham khảo nhanh."
  }

  if (includesAny(lowerMessage, ["tìm sách", "tìm kiếm", "search", "tên sách", "tác giả"])) {
    return "Để tìm sách, bạn nhập tên sách hoặc tên tác giả trong mục 'Sản phẩm' ở đầu trang. Bạn cũng có thể lọc theo thể loại, giá."
  }

  if (includesAny(lowerMessage, ["trạng thái đơn", "đơn hàng của tôi", "kiểm tra đơn", "đơn mua", "đang giao"])) {
    return "Bạn có thể xem trạng thái đơn hàng trong mục 'Lịch sử đơn hàng' sau khi đăng nhập. Nếu cần hỗ trợ gấp, bạn gửi mã đơn cho mình qua hotline hoặc email nhé."
  }

  if (includesAny(lowerMessage, ["huỷ đơn", "cancel", "huỷ đặt hàng"])) {
    return "Nếu đơn hàng của bạn chưa được xác nhận, KT.BookStore có thể hỗ trợ huỷ đơn. Bạn có thể hủy đơn hàng ở phần 'Lịch sử mua hàng' trong mục 'Thông tin cá nhân' hoặc vui lòng liên hệ hotline để được xử lý nhanh nhất."
  }

  if (includesAny(lowerMessage, ["đăng nhập", "đăng ký", "quên mật khẩu", "tài khoản"])) {
    return "Bạn có thể đăng ký hoặc đăng nhập bằng email/số điện thoại. Nếu quên mật khẩu, hãy dùng chức năng 'Quên mật khẩu' và làm theo hướng dẫn để lấy lại mật khẩu."
  }

  if (includesAny(lowerMessage, ["giờ mở cửa", "giờ làm việc", "mở cửa lúc mấy giờ"])) {
    return "Nhà sách KT.BookStore (online) mở 24/7, đặt lúc nào cũng được."
  }

  if (includesAny(lowerMessage, ["địa chỉ", "ở đâu", "chi nhánh", "cửa hàng"])) {
    return "Bạn có thể xem địa chỉ cụ thể ở mục 'Thông tin liên hệ' ở cuối trang."
  }

  if (includesAny(lowerMessage, ["liên hệ", "hỗ trợ", "cần giúp", "tư vấn"])) {
    return "Bạn có thể liên hệ KT.BookStore qua hotline: 0946280159 hoặc email: ltranbaokhanh@gmail.com. Đội ngũ chăm sóc khách hàng sẽ hỗ trợ bạn trong giờ hành chính."
  }

  return "Cảm ơn bạn đã nhắn cho KT.BookStore! Với các yêu cầu chi tiết hơn, bạn có thể gọi hotline: 0946280159 hoặc email: ltranbaokhanh@gmail.com"
}

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý ảo của KT.BookStore. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // ref dùng để auto scroll xuống cuối
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // mỗi khi messages thay đổi -> scroll tới cuối
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Nút chat nổi */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-200 transform hover:scale-110"
            size="lg"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80">
          <Card className="bg-white rounded-lg shadow-2xl border overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-600 text-white">
              <CardTitle className="text-lg font-semibold">Hỗ trợ khách hàng</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            {/* BODY */}
            <div className="flex flex-col">
              {/* Vùng tin nhắn: giới hạn chiều cao + thanh cuộn */}
              <div className="max-h-64 overflow-y-auto p-4 pr-2 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg break-words ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {msg.sender === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span className="text-xs opacity-75">
                          {msg.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* mốc để scroll tới cuối */}
                <div ref={messagesEndRef} />
              </div>

              {/* Ô nhập: luôn cố định phía dưới */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 min-h-[40px] max-h-[80px] resize-none"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
