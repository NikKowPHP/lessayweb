import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "lessay",
    template: "%s | lessay"
  },
  description: "Personalized language learning web app using AI to tailor the learning path based on an initial skills assessment.",
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
        <div className="pt-20">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
