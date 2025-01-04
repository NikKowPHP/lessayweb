import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <h1 className="text-4xl font-bold text-center mb-6">
        Learn a New Language with AI-Powered Personalization
      </h1>
      <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl">
        Get started with our adaptive learning system that creates a
        personalized learning path based on your skills and goals.
      </p>
      <Link
        href="/auth"
        className="bg-primary text-white px-8 py-3 rounded-md text-lg hover:bg-primary-dark transition-colors"
      >
        Start Learning Now
      </Link>
    </div>
  )
}
