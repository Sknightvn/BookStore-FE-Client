"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import type { Swiper as SwiperInstance } from "swiper"

interface CarouselImage {
  id: string
  src: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink?: string
}

const defaultImages: CarouselImage[] = [
  {
    id: "2",
    src: "/bookstore-banner-2.jpg",
    title: "Sách hay cho mỗi khoảnh khắc",
    subtitle: "Mỗi trang sách mở ra một thế giới mới, chạm vào cảm hứng và chữa lành tâm hồn.",
    buttonText: "Khám phá ngay",
    buttonLink: "/products",
  },
  {
    id: "3",
    src: "/bookstore-banner-3.jpg",
    title: "Đọc sách – đầu tư cho chính mình",
    subtitle: "Bồi đắp tri thức, nuôi dưỡng tư duy và xây dựng tương lai từ những điều nhỏ nhất.",
    buttonText: "Bắt đầu đọc",
    buttonLink: "/products",
  },
  {
    id: "4",
    src: "/bookstore-banner-4.jpg",
    title: "Bộ sưu tập dành riêng cho bạn",
    subtitle: "Tuyển chọn những tựa sách tinh hoa, phù hợp cho mọi sở thích và hành trình cuộc sống.",
    buttonText: "Xem bộ sưu tập",
    buttonLink: "/products",
  },
]

export default function ImageCarousel() {
  const swiperRef = useRef<SwiperInstance | null>(null)

  return (
    <section className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-xl">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full h-full"
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
      >
        {defaultImages.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full">
              <img src={image.src || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

              {/* Text Content */}
              <div className="absolute max-w-3xl inset-0 flex flex-col justify-center items-start px-8 md:px-16">
                <h2 className="text-4xl md:text-5xl font-light text-white mb-2 leading-tight text-balance uppercase">
                  {image.title}
                </h2>
                <p className="text-xl mt-2 md:text-2xl text-gray-100 mb-8">{image.subtitle}</p>
                <Button asChild variant="fulled">
                  <a href={image.buttonLink}>{image.buttonText}</a>
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons using Tabler icons */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-gray-800 shadow-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
        aria-label="Previous slide"
      >
        <IconChevronLeft size={24} />
      </button>

      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-gray-800 shadow-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
        aria-label="Next slide"
      >
        <IconChevronRight size={24} />
      </button>
    </section>
  )
}
