'use client'

import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'

const Navbar = () => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-[60px]">
          <Link href="/" className="text-2xl font-bold text-primary">
            lessay
          </Link>
          <div className="space-x-10">
            {isAuthenticated ? (
              <>
                <Link
                  href="/learning/path"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Learning Path
                </Link>
                <Link
                  href="/profile"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="#how-it-works"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/auth"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
