import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header/header";
import "@/styles/globals.css";
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Ziro Health",
    template: "%s | Ziro Health"
  },
  description: "Healthcare platform for modern practices",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <div className="pt-20">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
