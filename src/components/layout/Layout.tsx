'use client'

import { FC, ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
