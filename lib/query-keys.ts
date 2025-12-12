// Query keys factory for consistent cache management
export const queryKeys = {
    // Books
    books: ['books'] as const,
    book: (id: string) => ['books', id] as const,
    topProducts: ['books', 'top'] as const,

    // Orders
    orders: ['orders'] as const,
    userOrders: (userId: string) => ['orders', 'user', userId] as const,
    orderByCode: (code: string) => ['orders', 'code', code] as const,
    adminOrders: ['orders', 'admin'] as const,

    // Addresses
    addresses: (customerId: string) => ['addresses', customerId] as const,

    // Customers
    customer: (userId: string) => ['customer', userId] as const,

    // Categories
    categories: ['categories'] as const,

    // Promotions
    promotions: ['promotions'] as const,

    // Returns
    returnByOrderId: (orderId: string) => ['returns', 'order', orderId] as const,

    // Auth
    userProfile: (token?: string) => ['user', 'profile', token] as const,
} as const
