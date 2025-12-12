"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OrdersPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to profile page with orders tab
    router.replace("/profile?tab=orders")
  }, [router])

  return null
}
