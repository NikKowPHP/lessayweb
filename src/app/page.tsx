import { Suspense } from 'react'
import { Button } from '@/components/ui/button/button'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#EEF3FF] via-[#F3F8FF]/50 to-transparent"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-6">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[200px]">
            Loading...
          </div>
        }>
          <section className="py-32 space-y-8">
            <h1 className="text-[64px] leading-[1.1] font-medium tracking-[-0.02em] max-w-4xl">
              Pioneering Integrated Digital Health Solutions
            </h1>
            <p className="text-2xl text-gray-600 leading-relaxed max-w-3xl">
              Designing User-Friendly Technology for Better Patient Experiences, from Apps to Devices
            </p>
            <div className="flex gap-4 pt-4">
              <Button 
                size="lg" 
                className="rounded-full px-8 h-12 text-base bg-[#0066FF] hover:bg-[#0066FF]/90"
              >
                Book a call
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 h-12 text-base border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/10"
              >
                Learn more
              </Button>
            </div>
          </section>
        </Suspense>
      </div>
    </div>
  )
}
