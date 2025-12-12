"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import { message } from "antd"
import { useForgotPassword } from "@/hooks/useAuth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const forgotPasswordMutation = useForgotPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      messageApi.warning("Vui lòng nhập email!")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      messageApi.error("Email không hợp lệ!")
      return
    }

    forgotPasswordMutation.mutate(email, {
      onSuccess: (response) => {
        if (response.success) {
          messageApi.success(response.data)
          setIsSubmitted(true)

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login")
          }, 3000)
        }
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!"
        messageApi.error(errorMessage)
      },
    })
  }

  const handleBackToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {contextHolder}
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h2>
          <p className="mt-2 text-gray-600">Chúng tôi sẽ giúp bạn đặt lại mật khẩu</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Đặt lại mật khẩu</CardTitle>
            <CardDescription className="text-center">
              {isSubmitted ? "Kiểm tra email của bạn để nhận mật khẩu mới" : "Nhập email của bạn để nhận mật khẩu mới"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={forgotPasswordMutation.isPending}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mật khẩu mới sẽ được gửi đến email này</p>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? "Đang xử lý..." : "Gửi mật khẩu mới"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    Mật khẩu mới đã được gửi đến <strong>{email}</strong>
                  </p>
                  <p className="text-green-700 text-xs mt-2">Vui lòng kiểm tra email và đăng nhập với mật khẩu mới</p>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-gray-500">Tự động chuyển hướng trong 3 giây...</p>
                </div>
              </div>
            )}

            {/* Back to login link */}
            {!isSubmitted && (
              <div className="mt-6 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToLogin}
                  className="text-blue-600 hover:text-blue-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đăng nhập
                </Button>
              </div>
            )}

            {isSubmitted && (
              <div className="mt-6 text-center">
                <Button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đăng nhập
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
