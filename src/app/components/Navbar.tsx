import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'

const Navbar = () => {
  const pathname = usePathname()
  const { isAuthenticated } = useAppSelector((state) => state.user)

  const navLinks = [
    { href: '/', label: 'Home' },
    ...(isAuthenticated
      ? [
          { href: '/learning/path', label: 'My Learning Path' },
          { href: '/learning/assessment', label: 'Assessment' },
        ]
      : []),
  ]

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary">
            lessay
          </Link>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-primary transition-colors ${
                  pathname === link.href
                    ? 'text-primary font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <Link
                href="/auth"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Get Started
              </Link>
            ) : (
              <button
                onClick={() => {
                  /* Implement logout */
                }}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
