// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"

// export interface CartItem {
//   product: {
//     id: string
//     title: string
//     price: number
//     coverImage: string
//   }
//   quantity: number
// }

// export interface DeliveryAddress {
//   id: string
//   street: string
//   ward: string
//   district: string
//   city: string
// }

// interface CartContextType {
//   items: CartItem[]
//   addToCart: (product: any, quantity: number) => void
//   removeFromCart: (productId: string) => void
//   updateQuantity: (productId: string, quantity: number) => void
//   clearCart: () => void
//   getTotalItems: () => number
//   getTotalPrice: () => number
//   getShippingFee: () => number
//   getTax: () => number
//   getFinalTotal: () => number
//   deliveryAddresses: DeliveryAddress[]
//   selectedAddressId: string | null
//   saveDeliveryAddress: (address: Omit<DeliveryAddress, "id">) => void
//   selectAddress: (addressId: string) => void
//   deleteAddress: (addressId: string) => void
//   getSelectedAddress: () => DeliveryAddress | null
//   setDeliveryAddresses: (addresses: DeliveryAddress[]) => void
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([])
//   const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([])
//   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

//   // Load from localStorage on mount
//   useEffect(() => {
//     const savedItems = localStorage.getItem("cartItems")
//     const savedAddresses = localStorage.getItem("deliveryAddresses")
//     const savedAddressId = localStorage.getItem("selectedAddressId")

//     if (savedItems) setItems(JSON.parse(savedItems))
//     if (savedAddresses) setDeliveryAddresses(JSON.parse(savedAddresses))
//     if (savedAddressId) setSelectedAddressId(savedAddressId)
//   }, [])

//   // Save to localStorage whenever items change
//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(items))
//   }, [items])

//   useEffect(() => {
//     localStorage.setItem("deliveryAddresses", JSON.stringify(deliveryAddresses))
//   }, [deliveryAddresses])

//   useEffect(() => {
//     localStorage.setItem("selectedAddressId", selectedAddressId || "")
//   }, [selectedAddressId])

//   const addToCart = (product: any, quantity = 1) => {
//     setItems((prevItems) => {
//       const existingItem = prevItems.find((item) => item.product.id === product._id)
//       if (existingItem) {
//         return prevItems.map((item) =>
//           item.product.id === product._id ? { ...item, quantity: item.quantity + quantity } : item,
//         )
//       }
//       return [
//         ...prevItems,
//         {
//           product: {
//             id: product._id,
//             title: product.title,
//             price: product.price,
//             coverImage: product.coverImage,
//           },
//           quantity,
//         },
//       ]
//     })
//   }

//   const removeFromCart = (productId: string) => {
//     setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
//   }

//   const updateQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId)
//       return
//     }
//     setItems((prevItems) => prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
//   }

//   const clearCart = () => {
//     setItems([])
//   }

//   const getTotalItems = () => {
//     return items.reduce((total, item) => total + item.quantity, 0)
//   }

//   const getTotalPrice = () => {
//     return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
//   }

//   const getShippingFee = () => {
//     const total = getTotalPrice()
//     return total >= 200000 ? 0 : 30000
//   }

//   const getTax = () => {
//     return Math.round(getTotalPrice() * 0.1)
//   }

//   const getFinalTotal = () => {
//     return getTotalPrice() + getShippingFee() + getTax()
//   }

//   const saveDeliveryAddress = (address: Omit<DeliveryAddress, "id">) => {
//     const newAddress: DeliveryAddress = {
//       ...address,
//       id: Date.now().toString(),
//     }
//     setDeliveryAddresses((prev) => [...prev, newAddress])
//   }

//   const selectAddress = (addressId: string) => {
//     setSelectedAddressId(addressId)
//   }

//   const deleteAddress = (addressId: string) => {
//     setDeliveryAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
//     if (selectedAddressId === addressId) {
//       setSelectedAddressId(null)
//     }
//   }

//   const getSelectedAddress = () => {
//     return deliveryAddresses.find((addr) => addr.id === selectedAddressId) || null
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getTotalItems,
//         getTotalPrice,
//         getShippingFee,
//         getTax,
//         getFinalTotal,
//         deliveryAddresses,
//         selectedAddressId,
//         saveDeliveryAddress,
//         selectAddress,
//         deleteAddress,
//         getSelectedAddress,
//         setDeliveryAddresses
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const context = useContext(CartContext)
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider")
//   }
//   return context
// }

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

  // Cart operations
  addToCart: (product: CartItem["product"], quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number

  // Address operations
  selectAddress: (addressId: string) => void
  deleteAddress: (addressId: string) => void
  setDeliveryAddresses: (addresses: DeliveryAddress[]) => void
  getSelectedAddress: () => DeliveryAddress | null

  // Shipping & Tax
  getShippingFee: () => number
  getTax: () => number

  // Promotion operations
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
  const itemsRef = useRef<CartItem[]>([])

  // Cập nhật ref mỗi khi items thay đổi
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // API hooks
  const { data: serverCartData, isLoading: isLoadingCart } = useUserCart(
    user?.id,
    user?.email
  )
  const createCartMutation = useCreateUserCart()
  const updateCartMutation = useUpdateUserCart()

  // Helper function để lấy localStorage key cho cart
  const getCartStorageKey = (userId: string | null) => {
    return userId ? `cartItems_${userId}` : "cartItems_guest"
  }

  // Load from localStorage on mount (chỉ cho guest hoặc user hiện tại)
  useEffect(() => {
    const userId = user?.id || null
    const cartKey = getCartStorageKey(userId)

    const savedItems = localStorage.getItem(cartKey)
    const savedAddresses = localStorage.getItem("deliveryAddresses")
    const savedAddressId = localStorage.getItem("selectedAddressId")
    const savedPromotion = localStorage.getItem("appliedPromotion")

    // Chỉ load từ localStorage nếu là guest hoặc chưa có data từ server
    if (!user && savedItems) {
      setItems(JSON.parse(savedItems))
    }
    if (savedAddresses) setDeliveryAddresses(JSON.parse(savedAddresses))
    if (savedAddressId) setSelectedAddressId(savedAddressId)
    if (savedPromotion) setAppliedPromotion(JSON.parse(savedPromotion))

    setCurrentUserId(userId)
    setIsInitialized(true)
  }, [])

  // Xử lý khi user thay đổi (đăng nhập user khác hoặc logout)
  useEffect(() => {
    const newUserId = user?.id || null

    // Nếu user thay đổi, clear cart hiện tại và load cart của user mới
    if (isInitialized && currentUserId !== newUserId) {
      const currentItems = itemsRef.current

      // Lưu cart cũ vào localStorage trước khi clear (nếu có)
      if (currentUserId && currentItems.length > 0) {
        const oldCartKey = getCartStorageKey(currentUserId)
        localStorage.setItem(oldCartKey, JSON.stringify(currentItems))
      } else if (!currentUserId && currentItems.length > 0) {
        // Lưu cart guest trước khi đăng nhập
        const guestCartKey = getCartStorageKey(null)
        localStorage.setItem(guestCartKey, JSON.stringify(currentItems))
      }

      // Clear cart hiện tại
      setItems([])
      setAppliedPromotion(null)

      // Nếu logout, load cart guest từ localStorage
      if (!newUserId) {
        const guestCartKey = getCartStorageKey(null)
        const guestCart = localStorage.getItem(guestCartKey)
        if (guestCart) {
          try {
            setItems(JSON.parse(guestCart))
          } catch (e) {
            console.error("Error parsing guest cart:", e)
          }
        }
      }

      setCurrentUserId(newUserId)
    }
  }, [user?.id, isInitialized, currentUserId])

  // Load cart từ server khi có data mới (cho user hiện tại)
  useEffect(() => {
    if (user && currentUserId === user.id && !isLoadingCart && serverCartData) {
      if (serverCartData.success && serverCartData.data !== undefined) {
        // Có data từ server, dùng data từ server
        setItems(serverCartData.data || [])
      } else if (serverCartData.success) {
        // Server trả về success nhưng không có data (cart rỗng)
        setItems([])
      }
    }
  }, [serverCartData, user, currentUserId, isLoadingCart])

  // Save to localStorage khi items thay đổi (với key riêng cho mỗi user)
  useEffect(() => {
    if (isInitialized) {
      const userId = user?.id || null
      const cartKey = getCartStorageKey(userId)
      localStorage.setItem(cartKey, JSON.stringify(items))
    }
  }, [items, isInitialized, user?.id])

  // Sync với server khi items thay đổi (debounced để tránh quá nhiều requests)
  // Chỉ sync cho user hiện tại
  useEffect(() => {
    if (!isInitialized || !user || (!user.id && !user.email)) return
    if (currentUserId !== user.id) return // Chỉ sync cho user hiện tại

    const syncTimeout = setTimeout(() => {
      const cartRequest = {
        userId: user.id,
        email: user.email,
        productsCart: items,
      }

      // Kiểm tra xem cart đã tồn tại trên server chưa
      if (serverCartData?.success && serverCartData.data !== undefined) {
        // Update cart nếu đã tồn tại
        updateCartMutation.mutate(cartRequest)
      } else if (items.length > 0) {
        // Tạo cart mới nếu chưa tồn tại và có items
        createCartMutation.mutate(cartRequest)
      } else if (items.length === 0 && serverCartData?.success) {
        // Nếu cart rỗng nhưng server có cart, update để clear server cart
        updateCartMutation.mutate(cartRequest)
      }
    }, 1000) // Debounce 1 giây

    return () => clearTimeout(syncTimeout)
  }, [items, isInitialized, user, currentUserId, serverCartData?.success, createCartMutation, updateCartMutation])

  // Save addresses to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("deliveryAddresses", JSON.stringify(deliveryAddresses))
    }
  }, [deliveryAddresses, isInitialized])

  // Save selected address to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("selectedAddressId", selectedAddressId || "")
    }
  }, [selectedAddressId, isInitialized])

  // Save promotion to localStorage
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

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (subtotal < appliedPromotion.minOrderValue) return 0

    let discount = 0

    if (appliedPromotion.discountType === "percentage") {
      discount = Math.round((subtotal * appliedPromotion.discountValue) / 100)
    } else {
      discount = appliedPromotion.discountValue
    }

    // Áp dụng giới hạn giảm giá tối đa nếu có
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
    setItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((item: CartItem) => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map((item: CartItem) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prevItems, { product, quantity }]
    })
  }, [])

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

      // Kiểm tra giá trị đơn hàng tối thiểu
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
