import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthInit from "@/components/AuthInit";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "ShopModern | Premium Experience",
  description: "Experience the next generation of online shopping with ShopModern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${outfit.variable} font-outfit min-h-full flex flex-col antialiased`}>
        <StoreProvider>
          <AuthInit />
          <Toaster position="bottom-right" />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
