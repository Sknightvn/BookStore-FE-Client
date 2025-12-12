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

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

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
  const [items, setItems] = useState<CartItem[]>([])
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("cartItems")
    const savedAddresses = localStorage.getItem("deliveryAddresses")
    const savedAddressId = localStorage.getItem("selectedAddressId")
    const savedPromotion = localStorage.getItem("appliedPromotion")

    if (savedItems) setItems(JSON.parse(savedItems))
    if (savedAddresses) setDeliveryAddresses(JSON.parse(savedAddresses))
    if (savedAddressId) setSelectedAddressId(savedAddressId)
    if (savedPromotion) setAppliedPromotion(JSON.parse(savedPromotion))

    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cartItems", JSON.stringify(items))
    }
  }, [items, isInitialized])

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
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
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
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prevItems, { product, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        setItems((prevItems) => prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
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
      setDeliveryAddresses((prevAddresses) => prevAddresses.filter((addr) => addr.id !== addressId))
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null)
      }
    },
    [selectedAddressId],
  )

  const getSelectedAddress = useCallback(() => {
    return deliveryAddresses.find((addr) => addr.id === selectedAddressId) || null
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
