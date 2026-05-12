import React from 'react';
import Navbar from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050608] text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Terms of Service
          </h1>
          <p className="text-muted-foreground font-mono text-sm mb-12">Last Updated: May 13, 2026</p>
          
          <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-8 text-white/70 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the must-b platform, CLI, or services (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Subscription and Payments</h2>
              <p>
                Our order process is conducted by our online reseller Lemon Squeezy. Lemon Squeezy is the Merchant of Record for all our orders. They provide all customer service inquiries and handle returns.
              </p>
              <p>
                Subscriptions are billed in advance on a recurring basis. You can manage your subscription and payment methods through your dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Refund Policy</h2>
              <p>
                Refunds are handled according to Lemon Squeezy's standard policies. Please contact Lemon Squeezy or our support team if you encounter issues with your purchase. Generally, refunds are available within 14 days of purchase for unused credits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Usage Limits and Cognitive Credits</h2>
              <p>
                Must-b services are subject to usage limits defined by your subscription plan. "Cognitive Credits" are consumed for API operations and AI processing. If your daily limit is exceeded, service may be temporarily throttled or halted until the next reset period.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of must-b. Our CLI and software are protected by copyright and trade secret laws. Reverse engineering is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                In no event shall must-b, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@must-b.com.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}
