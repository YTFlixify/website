'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-2xl tracking-tighter">
                <span className="text-[#00517c]">FLIXIFY</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-zinc-300 mb-4">
                Welcome to Flixify. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <p className="text-zinc-300 mb-4">
                We may collect, use, store and transfer different kinds of personal data about you, including:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2">
                <li>Identity Data (name, username)</li>
                <li>Contact Data (email address)</li>
                <li>Profile Data (preferences, interests, feedback)</li>
                <li>Usage Data (how you use our website)</li>
                <li>Technical Data (IP address, browser type, device information)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-zinc-300 mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="text-zinc-300 mb-4">
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Your Legal Rights</h2>
              <p className="text-zinc-300 mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
              <p className="text-zinc-300 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-zinc-300">
                Email: business.flixify@gmail.com
              </p>
            </section>
          </div>

          <div className="mt-12">
            <Link href="/">
              <Button variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 py-8 border-t border-zinc-800 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="font-bold text-2xl tracking-tighter">
                <span className="text-[#00517c]">FLIXIFY</span>
              </Link>
              <p className="text-zinc-400 mt-2">© 2025 Flixify. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="text-zinc-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-zinc-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 