import Link from 'next/link'
import Image from 'next/image'

const features = [
  {
    title: 'AI-Powered Assessment',
    description:
      'Get a personalized evaluation of your language skills through our comprehensive assessment system.',
    icon: '🎯',
  },
  {
    title: 'Adaptive Learning Path',
    description:
      'Follow a customized learning journey that adapts to your progress and learning style.',
    icon: '🛣️',
  },
  {
    title: 'Interactive Exercises',
    description:
      'Practice with engaging exercises focusing on pronunciation, grammar, and comprehension.',
    icon: '✏️',
  },
  {
    title: 'Real-time Feedback',
    description:
      'Receive instant feedback on your pronunciation and grammar using advanced AI technology.',
    icon: '💭',
  },
]

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
            Master Any Language with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience personalized language learning powered by artificial
            intelligence. Start your journey to fluency today with our adaptive
            learning system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="bg-primary text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="#how-it-works"
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 px-4 w-full bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How lessay Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Language Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners who are achieving their language goals
            with lessay.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-primary px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Learning Now
          </Link>
        </div>
      </section>
    </main>
  )
}
