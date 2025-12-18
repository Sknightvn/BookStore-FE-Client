"use client"

import Link from "next/link"
import { useState } from "react"
import { IconShoppingCart, IconUserSquareRounded, IconSearch, IconMenu2, IconX, IconLogout } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"

import { useCart } from "@/contexts/cart-context"
import Image from "next/image"


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  // Get cart items count from cart context
  const { getTotalItems } = useCart()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    window.location.reload() 
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mr-4">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} quality={100} draggable={false} className="h-16 w-auto" />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 w-full justify-center">
            <Link href="/" className="text-indigo-950 hover:text-indigo-600 uppercase transition-colors duration-200 p-2">
              Trang chủ
            </Link>
            <Link
              href="/products"
              className="text-indigo-950 hover:text-indigo-600 transition-colors uppercase duration-200 p-2"
            >
              Sản phẩm
            </Link>
            <Link href="/blog" className="text-indigo-950 hover:text-indigo-600 uppercase transition-colors duration-200 p-2">
              Blog
            </Link>
            <Link
              href="/about"
              className="text-indigo-950 hover:text-indigo-600 uppercase transition-colors duration-200 p-2"
            >
              Giới thiệu
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            {/* <div className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm sách..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div> */}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
          <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
              asChild
            >
              <Link href="/cart">
                <IconShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-sm bg-indigo-100 text-indigo-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <IconUserSquareRounded size={20} />
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center">
                      <IconShoppingCart size={20} />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                    <IconLogout size={16} />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="fulled"
                size="sm"
                className="hidden md:flex items-center hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 !py-0"
                asChild
              >
                <Link href="/login">
                  <IconUserSquareRounded size={20} />
                  <span>Đăng nhập</span>
                </Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t ">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="mb-4">
                <Input type="text" placeholder="Tìm kiếm sách..." className="w-full" />
              </div>
              <Link
                href="/"
                className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              {/* Added cart link to mobile menu */}
              <Link
                href="/cart"
                className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Giỏ hàng ({getTotalItems()})
              </Link>
              <div className="border-t pt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500">Xin chào, {user.name}</div>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Thông tin cá nhân
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className="block px-3 py-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
