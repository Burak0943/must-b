import React from 'react';
import Navbar from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground font-mono text-sm mb-12">Last Updated: May 13, 2026</p>
          
          <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-8 text-white/70 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                At must-b, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our autonomous AI agents and related services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p>
                <strong>Account Data:</strong> When you register, we collect your email address and basic profile information through Supabase Auth.
              </p>
              <p>
                <strong>Payment Data:</strong> All payment information is processed securely by Lemon Squeezy. We do not store your credit card details on our servers.
              </p>
              <p>
                <strong>Operational Data:</strong> We collect metadata related to CLI usage and API consumption to manage usage limits and ensure system stability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Information</h2>
              <p>
                We use your information to provide and maintain the Service, process payments via Lemon Squeezy, manage your account through Supabase, and communicate updates or security alerts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data. Supabase provides our backend security infrastructure, ensuring your data is encrypted and accessible only to authorized entities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Cookies and Tracking</h2>
              <p>
                We use essential cookies for authentication and session management. We do not use tracking pixels or intrusive advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Third-Party Services</h2>
              <p>
                We rely on third-party providers to deliver our Service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> For authentication and database management.</li>
                <li><strong>Lemon Squeezy:</strong> For secure payment processing and reseller services.</li>
                <li><strong>Vercel:</strong> For hosting our web platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal data. You can manage your profile settings in the dashboard or contact us at privacy@must-b.com for data deletion requests.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}
