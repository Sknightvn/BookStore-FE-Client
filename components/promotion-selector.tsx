"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { SAMPLE_PROMOTIONS } from "@/data/promotions"
import { Gift, X, Check, AlertCircle } from "lucide-react"
import { message } from "antd"

export default function PromotionSelector() {
  const { appliedPromotion, applyPromotion, removePromotion, getTotalPrice, getDiscountAmount } = useCart()
  const [showPromotions, setShowPromotions] = useState(false)

  const subtotal = getTotalPrice()
  const availablePromotions = SAMPLE_PROMOTIONS.filter((promo) => promo.active && subtotal >= promo.minOrderValue)
  const unavailablePromotions = SAMPLE_PROMOTIONS.filter((promo) => promo.active && subtotal < promo.minOrderValue)

  const handleApplyPromotion = (promotion: (typeof SAMPLE_PROMOTIONS)[0]) => {
    const success = applyPromotion(promotion)
    if (success) {
      message.success(`Áp dụng khuyến mãi "${promotion.name}" thành công!`)
      setShowPromotions(false)
    } else {
      message.error(`Không thể áp dụng khuyến mãi này. Giá trị đơn hàng không đủ.`)
    }
  }

  const handleRemovePromotion = () => {
    removePromotion()
    message.success("Đã hủy khuyến mãi")
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gift className="w-5 h-5 text-amber-500" />
          <span>Khuyến mãi áp dụng được</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Applied Promotion Display */}
        {appliedPromotion ? (
          <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-700">{appliedPromotion.name}</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    {appliedPromotion.code}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{appliedPromotion.description}</p>
                <p className="text-sm font-semibold text-green-600 mt-2">
                  Tiết kiệm: {getDiscountAmount().toLocaleString("vi-VN")}đ
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePromotion}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-gray-500 text-sm">Chưa có khuyến mãi nào được áp dụng</div>
        )}

        <Separator />

        {/* Available Promotions */}
        <div>
          <Button
            variant="outline"
            className="w-full justify-between bg-transparent"
            onClick={() => setShowPromotions(!showPromotions)}
          >
            <span>
              {availablePromotions.length > 0
                ? `Xem ${availablePromotions.length} khuyến mãi khác`
                : "Không có khuyến mãi khác"}
            </span>
            <span className="text-xs">{showPromotions ? "▲" : "▼"}</span>
          </Button>

          {showPromotions && availablePromotions.length > 0 && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {availablePromotions.map((promo) => (
                <div
                  key={promo.id}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    appliedPromotion?.id === promo.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-amber-300 bg-gray-50"
                  }`}
                  onClick={() => handleApplyPromotion(promo)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">{promo.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {promo.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{promo.description}</p>
                      <p className="text-xs text-amber-600 mt-1">
                        {promo.discountType === "percentage"
                          ? `Giảm ${promo.discountValue}%`
                          : `Giảm ${promo.discountValue.toLocaleString("vi-VN")}đ`}
                      </p>
                    </div>
                    {appliedPromotion?.id === promo.id && (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showPromotions && unavailablePromotions.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-500 font-medium">Khuyến mãi khác:</p>
              {unavailablePromotions.map((promo) => (
                <div key={promo.id} className="p-2 rounded-lg border border-gray-200 bg-gray-50 opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-semibold text-gray-600">{promo.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {promo.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{promo.description}</p>
                    </div>
                    <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2">
                Mua thêm{" "}
                {(Math.min(...unavailablePromotions.map((p) => p.minOrderValue)) - subtotal).toLocaleString("vi-VN")}đ
                để mở khóa khuyến mãi
              </p>
            </div>
          )}

          {!showPromotions && availablePromotions.length === 0 && unavailablePromotions.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">Không có khuyến mãi nào</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
