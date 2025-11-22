import { motion } from "motion/react";
import ParticleBackground from "../components/ParticleBackground";

export default function TermsPage() {
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
            Terms of Use
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
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using our website, you agree to be bound by these
              Terms of Use and our Privacy Policy. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              2. Intellectual Property Rights
            </h2>
            <p>
              Unless otherwise indicated, the Site and its entire contents,
              features, and functionality (including but not limited to all
              information, software, text, displays, images, video, and audio,
              and the design, selection, and arrangement thereof) are owned by
              Elemental AI, its licensors, or other providers of such material
              and are protected by copyright, trademark, patent, trade secret,
              and other intellectual property or proprietary rights laws.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              3. User Representations
            </h2>
            <p>By using the Site, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All registration information you submit will be true, accurate,
                current, and complete.
              </li>
              <li>
                You will maintain the accuracy of such information and promptly
                update such registration information as necessary.
              </li>
              <li>
                You have the legal capacity and you agree to comply with these
                Terms of Use.
              </li>
              <li>
                You are not a minor in the jurisdiction in which you reside.
              </li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              4. Prohibited Activities
            </h2>
            <p>
              You may not access or use the Site for any purpose other than that
              for which we make the Site available. The Site may not be used in
              connection with any commercial endeavors except those that are
              specifically endorsed or approved by us.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-text dark:text-white">
              5. Limitation of Liability
            </h2>
            <p>
              In no event will we or our directors, employees, or agents be
              liable to you or any third party for any direct, indirect,
              consequential, exemplary, incidental, special, or punitive
              damages, including lost profit, lost revenue, loss of data, or
              other damages arising from your use of the site, even if we have
              been advised of the possibility of such damages.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
