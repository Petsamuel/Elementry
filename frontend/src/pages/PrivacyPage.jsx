import { motion } from "motion/react";
import ParticleBackground from "../components/ParticleBackground";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <ParticleBackground />

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 relative z-10 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-text dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-text-muted text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert max-w-none text-text-muted"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              1. Introduction
            </h2>
            <p>
              Welcome to Elemental AI. We respect your privacy and are committed
              to protecting your personal data. This privacy policy will inform
              you as to how we look after your personal data when you visit our
              website and tell you about your privacy rights and how the law
              protects you.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              2. Data We Collect
            </h2>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Identity Data:</strong> includes first name, last name,
                username or similar identifier.
              </li>
              <li>
                <strong>Contact Data:</strong> includes email address.
              </li>
              <li>
                <strong>Technical Data:</strong> includes internet protocol (IP)
                address, your login data, browser type and version, time zone
                setting and location, browser plug-in types and versions,
                operating system and platform, and other technology on the
                devices you use to access this website.
              </li>
              <li>
                <strong>Usage Data:</strong> includes information about how you
                use our website, products and services.
              </li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              3. How We Use Your Data
            </h2>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Where we need to perform the contract we are about to enter into
                or have entered into with you.
              </li>
              <li>
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              4. Data Security
            </h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to
              know.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this privacy policy or our privacy
              practices, please contact us.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
