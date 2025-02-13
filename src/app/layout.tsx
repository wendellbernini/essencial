import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script'
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareFloatingButton } from '@/components/products/CompareFloatingButton'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Essencial - Sua loja de cosméticos",
  description: "Os melhores produtos de beleza você encontra aqui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <Script
          src="https://sdk.mercadopago.com/js/v2"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <CompareFloatingButton />
            <Footer />
            <Toaster richColors />
          </div>
        </Providers>
      </body>
    </html>
  );
}
