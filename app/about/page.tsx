"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, Heart, Target, Truck, Shield, Clock, Star, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

const stats = [
  { icon: BookOpen, label: "Đầu sách", value: "50,000+", color: "text-blue-600" },
  { icon: Users, label: "Khách hàng", value: "100,000+", color: "text-green-600" },
  { icon: Award, label: "Năm kinh nghiệm", value: "15+", color: "text-purple-600" },
  { icon: Heart, label: "Đánh giá 5 sao", value: "98%", color: "text-red-600" },
]

const values = [
  {
    icon: Target,
    title: "Sứ mệnh",
    description: "Mang tri thức đến gần hơn với mọi người thông qua những cuốn sách chất lượng và dịch vụ tận tâm.",
  },
  {
    icon: Heart,
    title: "Tầm nhìn",
    description: "Trở thành nhà sách trực tuyến hàng đầu Việt Nam, nơi mọi người có thể tìm thấy cuốn sách yêu thích.",
  },
  {
    icon: Star,
    title: "Giá trị cốt lõi",
    description: "Chất lượng, uy tín, tận tâm và luôn đặt khách hàng làm trung tâm trong mọi hoạt động.",
  },
]

const services = [
  {
    icon: Truck,
    title: "Giao hàng nhanh chóng",
    description: "Giao hàng trong 24h tại TP.HCM và 2-3 ngày toàn quốc",
  },
  {
    icon: Shield,
    title: "Bảo hành chất lượng",
    description: "Đổi trả miễn phí trong 7 ngày nếu sách có lỗi",
  },
  {
    icon: Clock,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ tư vấn sẵn sàng hỗ trợ bạn mọi lúc",
  },
]

const team = [
  {
    name: "Lưu Trần Bảo Khánh",
    role: "Giám đốc điều hành",
    image: "/ChatGPT Image 17_34_09 10 thg 12, 2025.png",
    description: "15 năm kinh nghiệm trong ngành xuất bản và phân phối sách",
  },
  {
    name: "Trần Thị B",
    role: "Trưởng phòng Marketing",
    image: "/marketing-manager-portrait.png",
    description: "Chuyên gia marketing với niềm đam mê sách và văn hóa đọc",
  },
  {
    name: "Nguyễn Văn Nhật Trường",
    role: "Trưởng phòng Kỹ thuật",
    image: "/tech-lead-portrait.png",
    description: "Kỹ sư phần mềm với 10 năm kinh nghiệm phát triển e-commerce",
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Về KT.BookStore</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Chúng tôi là nhà sách trực tuyến hàng đầu Việt Nam, cam kết mang đến cho bạn những cuốn sách chất lượng với
          dịch vụ tốt nhất và giá cả hợp lý nhất.
        </p>
        <div className="relative">
          <img
            src="/colorful-book-stack.png"
            alt="BookStore"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                KT.BookStore được thành lập vào năm 2009 với mong muốn đơn giản: làm cho việc mua sách trở nên dễ dàng và
                thuận tiện hơn cho mọi người. Bắt đầu từ một cửa hàng nhỏ, chúng tôi đã phát triển thành một trong những
                nhà sách trực tuyến lớn nhất Việt Nam.
              </p>
              <p>
                Với hơn 15 năm kinh nghiệm, chúng tôi hiểu rõ nhu cầu và mong muốn của độc giả Việt Nam. Từ sách văn
                học, kinh tế, kỹ năng sống đến sách thiếu nhi, chúng tôi luôn cập nhật những đầu sách mới nhất và chất
                lượng nhất.
              </p>
              <p>
                Không chỉ bán sách, chúng tôi còn xây dựng một cộng đồng yêu sách, nơi mọi người có thể chia sẻ đam mê
                đọc sách và khám phá những tác phẩm hay.
              </p>
            </div>
          </div>
          <div className="relative">
            <img src="/bookstore-history-timeline.png" alt="Lịch sử BookStore" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Sứ mệnh & Tầm nhìn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <value.icon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Dịch vụ của chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <service.icon className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Đội ngũ của chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">{member.role}</Badge>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Liên hệ với chúng tôi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Địa chỉ</h3>
                <p className="text-gray-600">
                  55/30 Đường số 7, Phường 7
                  <br />
                  Quận Gò Vấp, TP.HCM
                  <br />
                  Việt Nam
                </p>
              </div>
              <div className="text-center">
                <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Điện thoại</h3>
                <p className="text-gray-600">
                  Hotline: (094) 6280 159
                  <br />
                  Hỗ trợ: (094) 6280 159
                  <br />
                  8:00 - 22:00 (T2-CN)
                </p>
              </div>
              <div className="text-center">
                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">
                  ltranbaokhanh@gmail.com
                  <br />
                  nguyenvannhattruong2002@gmail.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Bắt đầu hành trình đọc sách cùng chúng tôi</h2>
            <p className="text-xl mb-8 opacity-90">Khám phá hàng ngàn đầu sách chất lượng với giá tốt nhất</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Khám phá sách
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                asChild
              >
                <Link href="/register">
                  <Users className="w-5 h-5 mr-2" />
                  Đăng ký ngay
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
