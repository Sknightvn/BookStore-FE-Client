import type { Promotion } from "@/contexts/cart-context"
import { API_URL as BASE_API_URL } from "@/lib/config"

const API_URL = `${BASE_API_URL}/promotions`

let SAMPLE_PROMOTIONS: Promotion[] = []

async function loadPromotions() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" })
    const json = await res.json()

    const data = json.data || []

    SAMPLE_PROMOTIONS = data.map((p: any): Promotion => ({
      id: p._id,
      code: p.code,
      name: p.title ?? p.code,
      description: p.description ?? "",
      discountType: p.type === "percent" ? "percentage" : "fixed",
      discountValue:
        p.type === "percent" ? p.discountPercent : p.discountAmount,
      minOrderValue: p.minOrderValue ?? 0,
      maxDiscount: p.maxDiscount ?? undefined,
      active: p.status === "active" && !p.isDelete,
    }))
  } catch (err) {
    console.error("❌ Lỗi gọi API khuyến mãi:", err)
    SAMPLE_PROMOTIONS = []
  }
}

// Gọi API ngay khi file được import
loadPromotions()

export { SAMPLE_PROMOTIONS }
