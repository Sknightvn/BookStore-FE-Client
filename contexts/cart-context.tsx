"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { useAuth } from "./auth-context"
import { useUserCart, useCreateUserCart, useUpdateUserCart } from "@/hooks/useCart"

export interface CartItem {
  product: {
    id: string
    title: string
    price: number
    coverImage: string
    volume: string
  }
  quantity: number
}

export interface DeliveryAddress {
  id: string
  street: string
  ward: string
  district: string
  city: string
}

export interface Promotion {
  id: string
  code: string
  name: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderValue: number
  maxDiscount?: number
  active: boolean
}

interface CartContextType {
  items: CartItem[]
  deliveryAddresses: DeliveryAddress[]
  selectedAddressId: string | null
  appliedPromotion: Promotion | null
  addToCart: (product: CartItem["product"], quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  selectAddress: (addressId: string) => void
  deleteAddress: (addressId: string) => void
  setDeliveryAddresses: (addresses: DeliveryAddress[]) => void
  getSelectedAddress: () => DeliveryAddress | null
  getShippingFee: () => number
  getTax: () => number
  applyPromotion: (promotion: Promotion) => boolean
  removePromotion: () => void
  getDiscountAmount: () => number
  getFinalTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isCartCleared, setIsCartCleared] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isCartCleared') === 'true'
    }
    return false
  })
  const itemsRef = useRef<CartItem[]>([])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const { data: serverCartData, isLoading: isLoadingCart } = useUserCart(user?.id, user?.email)
  const createCartMutation = useCreateUserCart()
  const updateCartMutation = useUpdateUserCart()

  const getCartStorageKey = (userId: string | null) => {
    return userId ? `cartItems_${userId}` : "cartItems_guest"
  }

  const mergeCartItems = (baseItems: CartItem[], extraItems: CartItem[]): CartItem[] => {
    const map = new Map<string, CartItem>()
    const addItems = (list: CartItem[]) => {
      list.forEach((item) => {
        const key = item.product.id
        const existing = map.get(key)
        if (existing) {
          map.set(key, { ...existing, quantity: existing.quantity + item.quantity })
        } else {
          map.set(key, { ...item })
        }
      })
    }
    addItems(baseItems)
    addItems(extraItems)
    return Array.from(map.values())
  }

  useEffect(() => {
    const userId = user?.id || null
    const cartKey = getCartStorageKey(userId)
    const savedItems = localStorage.getItem(cartKey)
    const savedAddresses = localStorage.getItem("deliveryAddresses")
    const savedAddressId = localStorage.getItem("selectedAddressId")
    const savedPromotion = localStorage.getItem("appliedPromotion")
    if (!user && savedItems) {
      try {
        setItems(JSON.parse(savedItems))
      } catch (e) {}
    }
    if (savedAddresses) setDeliveryAddresses(JSON.parse(savedAddresses))
    if (savedAddressId) setSelectedAddressId(savedAddressId)
    if (savedPromotion) setAppliedPromotion(JSON.parse(savedPromotion))
    setCurrentUserId(userId)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    const newUserId = user?.id || null
    if (currentUserId === newUserId) return
    const prevUserId = currentUserId
    const currentItems = itemsRef.current
    if (prevUserId && currentItems.length > 0) {
      const oldCartKey = getCartStorageKey(prevUserId)
      localStorage.setItem(oldCartKey, JSON.stringify(currentItems))
    } else if (!prevUserId && currentItems.length > 0) {
      const guestCartKey = getCartStorageKey(null)
      localStorage.setItem(guestCartKey, JSON.stringify(currentItems))
    }
    if (!prevUserId && newUserId) {
      const guestCartKey = getCartStorageKey(null)
      const guestCartRaw = localStorage.getItem(guestCartKey)
      let guestItems: CartItem[] = []
      if (guestCartRaw) {
        try {
          guestItems = JSON.parse(guestCartRaw)
        } catch (e) {}
      }
      const serverItems: CartItem[] =
        serverCartData?.success && Array.isArray(serverCartData.data) ? serverCartData.data : []
      const mergedItems = mergeCartItems(serverItems, guestItems)
      setItems(mergedItems)
      setAppliedPromotion(null)
      localStorage.removeItem(guestCartKey)
    }
    if (prevUserId && !newUserId) {
      setItems([])
      setAppliedPromotion(null)
    }
    if (prevUserId && newUserId && prevUserId !== newUserId) {
      const newCartKey = getCartStorageKey(newUserId)
      const newCartRaw = localStorage.getItem(newCartKey)
      let newItems: CartItem[] = []
      if (newCartRaw) {
        try {
          newItems = JSON.parse(newCartRaw)
        } catch (e) {}
      }
      setItems(newItems)
      setAppliedPromotion(null)
    }
    setCurrentUserId(newUserId)
  }, [user?.id, isInitialized, currentUserId, serverCartData])

  useEffect(() => {
    if (isCartCleared) return
    if (user && currentUserId === user.id && !isLoadingCart && serverCartData) {
      if (serverCartData.success && serverCartData.data !== undefined) {
        setItems((prev) => {
          if (prev.length > 0) return prev
          return serverCartData.data || []
        })
      } else if (serverCartData.success) {
        setItems((prev) => (prev.length > 0 ? prev : []))
      }
    }
  }, [serverCartData, user, currentUserId, isLoadingCart, isCartCleared])

  useEffect(() => {
    if (isInitialized) {
      const userId = user?.id || null
      const cartKey = getCartStorageKey(userId)
      localStorage.setItem(cartKey, JSON.stringify(items))
    }
  }, [items, isInitialized, user?.id])

  useEffect(() => {
    if (!isInitialized || !user || (!user.id && !user.email)) return
    if (currentUserId !== user.id) return
    const syncTimeout = setTimeout(() => {
      const cartRequest = {
        userId: user.id,
        email: user.email,
        productsCart: items,
      }
      if (serverCartData?.success && serverCartData.data !== undefined) {
        updateCartMutation.mutate(cartRequest)
      } else if (items.length > 0) {
        createCartMutation.mutate(cartRequest)
      } else if (items.length === 0 && serverCartData?.success) {
        updateCartMutation.mutate(cartRequest)
      }
    }, 1000)
    return () => clearTimeout(syncTimeout)
  }, [items, isInitialized, user, currentUserId, serverCartData?.success, createCartMutation, updateCartMutation])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("deliveryAddresses", JSON.stringify(deliveryAddresses))
    }
  }, [deliveryAddresses, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("selectedAddressId", selectedAddressId || "")
    }
  }, [selectedAddressId, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("appliedPromotion", JSON.stringify(appliedPromotion))
    }
  }, [appliedPromotion, isInitialized])

  const getTotalItems = useCallback(() => {
    return items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  }, [items])

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0)
  }, [items])

  const getShippingFee = useCallback(() => {
    const total = getTotalPrice()
    if (total >= 200000) return 0
    if (total >= 100000) return 15000
    return 30000
  }, [getTotalPrice])

  const getTax = useCallback(() => {
    return Math.round(getTotalPrice() * 0.1)
  }, [getTotalPrice])

  const getDiscountAmount = useCallback(() => {
    if (!appliedPromotion) return 0
    const subtotal = getTotalPrice()
    if (subtotal < appliedPromotion.minOrderValue) return 0
    let discount = 0
    if (appliedPromotion.discountType === "percentage") {
      discount = Math.round((subtotal * appliedPromotion.discountValue) / 100)
    } else {
      discount = appliedPromotion.discountValue
    }
    if (appliedPromotion.maxDiscount) {
      discount = Math.min(discount, appliedPromotion.maxDiscount)
    }
    return discount
  }, [appliedPromotion, getTotalPrice])

  const getFinalTotal = useCallback(() => {
    const subtotal = getTotalPrice()
    const discount = getDiscountAmount()
    const shipping = getShippingFee()
    const tax = getTax()
    return subtotal - discount + shipping + tax
  }, [getTotalPrice, getDiscountAmount, getShippingFee, getTax])

  const addToCart = useCallback((product: CartItem["product"], quantity: number) => {
    if (isCartCleared) {
      setIsCartCleared(false)
      localStorage.removeItem('isCartCleared')
    }
    setItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((item: CartItem) => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map((item: CartItem) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prevItems, { product, quantity }]
    })
  }, [isCartCleared])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems: CartItem[]) => prevItems.filter((item: CartItem) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        setItems((prevItems: CartItem[]) => prevItems.map((item: CartItem) => (item.product.id === productId ? { ...item, quantity } : item)))
      }
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedPromotion(null)
    setIsCartCleared(true)
    localStorage.setItem('isCartCleared', 'true')
  }, [])

  const selectAddress = useCallback((addressId: string) => {
    setSelectedAddressId(addressId)
  }, [])

  const deleteAddress = useCallback(
    (addressId: string) => {
      setDeliveryAddresses((prevAddresses: DeliveryAddress[]) => prevAddresses.filter((addr: DeliveryAddress) => addr.id !== addressId))
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null)
      }
    },
    [selectedAddressId],
  )

  const getSelectedAddress = useCallback(() => {
    return deliveryAddresses.find((addr: DeliveryAddress) => addr.id === selectedAddressId) || null
  }, [deliveryAddresses, selectedAddressId])

  const applyPromotion = useCallback(
    (promotion: Promotion) => {
      const subtotal = getTotalPrice()
      if (subtotal < promotion.minOrderValue) {
        return false
      }
      setAppliedPromotion(promotion)
      return true
    },
    [getTotalPrice],
  )

  const removePromotion = useCallback(() => {
    setAppliedPromotion(null)
  }, [])

  const value: CartContextType = {
    items,
    deliveryAddresses,
    selectedAddressId,
    appliedPromotion,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    selectAddress,
    deleteAddress,
    setDeliveryAddresses,
    getSelectedAddress,
    getShippingFee,
    getTax,
    applyPromotion,
    removePromotion,
    getDiscountAmount,
    getFinalTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
