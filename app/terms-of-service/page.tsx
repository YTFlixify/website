'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-zinc-300 mb-4">
                By accessing and using Flixify, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-zinc-300 mb-4">
                Flixify provides a platform for streaming and sharing video content. The service includes access to various features such as video uploads, content management, and user interaction tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-zinc-300 mb-4">
                To access certain features of the service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Content Guidelines</h2>
              <p className="text-zinc-300 mb-4">
                Users are responsible for the content they upload and share on Flixify. The following content is prohibited:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2">
                <li>Content that violates any laws or regulations</li>
                <li>Content that infringes on intellectual property rights</li>
                <li>Content that is defamatory, obscene, or offensive</li>
                <li>Content that promotes violence or hate speech</li>
                <li>Content that contains malware or harmful code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-zinc-300 mb-4">
                All content on Flixify, including but not limited to text, graphics, logos, and software, is the property of Flixify or its content suppliers and is protected by international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-zinc-300 mb-4">
                Flixify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
              <p className="text-zinc-300 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date at the top of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
              <p className="text-zinc-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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