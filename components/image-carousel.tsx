"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    title: "Sách hay",
    subtitle: "Cuộc sống tốt hơn",
    buttonText: "Xem ngay",
    buttonLink: "/products",
  },
  {
    id: "3",
    src: "/bookstore-banner-3.jpg",
    title: "Đọc sách",
    subtitle: "Mở rộng kiến thức",
    buttonText: "Khám phá",
    buttonLink: "/products",
  },
  {
    id: "4",
    src: "/bookstore-banner-4.jpg",
    title: "Bộ sưu tập",
    subtitle: "Những cuốn sách hay nhất",
    buttonText: "Mua ngay",
    buttonLink: "/products",
  },
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + defaultImages.length) % defaultImages.length)
    setAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % defaultImages.length)
    setAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setAutoPlay(false)
  }

  const currentImage = defaultImages[currentIndex]

  return (
    <section
      className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-xl"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Images Container */}
      <div className="relative w-full h-full">
        {defaultImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image.src || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight text-balance">
                {image.title}
              </h2>
              <p className="text-xl md:text-2xl text-orange-400 font-semibold mb-8">{image.subtitle}</p>
              <Button asChild className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-6 text-lg">
                <a href={image.buttonLink}>{image.buttonText}</a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {defaultImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-8 h-3" : "bg-white/40 w-3 h-3 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
