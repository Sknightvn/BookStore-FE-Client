import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import ChatbotWrapper from "@/components/ChatbotWrapper";
import { QueryProvider } from "@/lib/query-provider";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "BookStore - Cửa hàng sách trực tuyến",
  description:
    "Cửa hàng sách trực tuyến hàng đầu Việt Nam với hàng ngàn đầu sách chất lượng",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <NextTopLoader
          color="#4f46e5"
          height={3}
          crawlSpeed={150}
          showSpinner={false}
          shadow="0 0 10px #4f46e5,0 0 5px #4f46e5"
        />
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main 
              style={{
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/doodle-background.png')",
                backgroundSize: "500px auto",
                backgroundPosition: "top left",
                backgroundRepeat: "repeat",
              }}
              className="flex-1">{children}</main>
              <Footer />
              <ChatbotWrapper />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
