import Link from "next/link"
import { IconBrandFacebook, IconBrandInstagram, IconMail, IconPhone, IconMapPin } from "@tabler/icons-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2 mr-4">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} quality={100} draggable={false} className="h-10 w-auto" />
          </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Cửa hàng sách trực tuyến hàng đầu Việt Nam, cung cấp hàng ngàn đầu sách chất lượng với giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/baokhanh.luutran.5/" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <IconBrandFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/ltrbao.khanhh/" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <IconBrandInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/order-tracking"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Tra cứu đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <IconMapPin size={16} className="text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">55/30 Đường số 7, Phường 7, Quận Gò Vấp, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <IconPhone size={16} className="text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">(094) 6280 159</span>
              </div>
              <div className="flex items-center space-x-3">
                <IconMail size={16} className="text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">ltranbaokhanh@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 KT.BookStore. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
