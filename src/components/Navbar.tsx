'use client'

import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'

const Navbar = () => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            lessay
          </Link>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/learning/path"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Learning Path
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link href="/auth" className="text-gray-700 hover:text-gray-900">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
