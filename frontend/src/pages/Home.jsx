import { motion } from "motion/react";
import {
  ArrowRight,
  Layers,
  Zap,
  Globe,
  Sparkles,
  Check,
  Star,
} from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";
import logo2 from "../assets/logo2.png";
import googleLogo from "../assets/google.webp";
import metaLogo from "../assets/meta.webp";
import netflixLogo from "../assets/netflix.webp";
import reactLogo from "../assets/react.svg";

export default function Home({ onStart }) {
  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-text dark:text-white">
              Start small.
              <br />
              <span className="text-accent dark:text-green-400">
                Build smart.
              </span>
            </h1>

            <p className="text-xl text-text-muted max-w-xl leading-relaxed">
              Elemental AI breaks your idea into clear business paths, finds the
              easiest point to start from, and gives you pivot options when
              things get stuck.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="group px-8 py-4 bg-accent hover:bg-accent-hover  rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-black "
              >
                Break Down My Idea
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-text dark:text-white">
                    4.9/5
                  </span>
                </div>
                <span className="text-sm text-text-muted">
                  trusted by over 2,800 founders
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Grid Visual */}
          <div className="relative h-[600px] hidden md:block">
            {/* Abstract Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl opacity-50" />

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-[200px]"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-sm mb-1 dark:text-white">
                Global Reach
              </h3>
              <p className="text-xs text-gray-500 ">
                Scale your idea worldwide
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-40 left-10 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-[220px] z-20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm dark:text-white">
                    Fast Launch
                  </h3>
                  <p className="text-xs text-green-600 font-semibold ">
                    +300% Speed
                  </p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-green-500 rounded-full" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-20 right-20 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-[200px]"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-sm mb-1 dark:text-white">
                7 Streams
              </h3>
              <p className="text-xs text-gray-500">Revenue models unlocked</p>
            </motion.div>

            {/* Center Hero Image/Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] bg-white dark:bg-gray-900 p-2 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 z-10 rotate-[-6deg]"
            >
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Founder Success"
                className="w-full h-[320px] object-cover rounded-2xl"
              />
              <div className="p-4 text-center">
                <p className="font-bold text-lg dark:text-white">
                  Sarah Johnson
                </p>
                <p className="text-sm text-accent">Launched in 3 weeks</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Social Proof */}
      <section className="py-16 relative z-10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          {/* Statistics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { value: "10,000+", label: "Entrepreneurs" },
              { value: "500+", label: "Businesses Launched" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "$47K", label: "Avg. Capital Saved" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-text dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Logos */}
          <div className="text-center space-y-8">
            <p className="text-text-muted text-sm font-medium uppercase tracking-wider">
              Trusted by innovative companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity duration-300">
              {[googleLogo, metaLogo, netflixLogo, reactLogo, logo2].map(
                (logo, i) => (
                  <img
                    key={i}
                    src={logo}
                    alt="Partner Logo"
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Bento Layout */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24 relative z-10"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text dark:text-white mb-4">
            The Intelligence of Gradual Growth
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            AI that thinks like a builder — giving structure to dreams, one
            element at a time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Bento Item 1: Large Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                  Business Deconstruction Engine
                </h3>
                <p className="text-text-muted text-lg max-w-md">
                  Enter any idea and watch it break into 7 distinct money-making
                  businesses. From production to franchising, see every
                  opportunity.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-medium text-text dark:text-white border border-gray-100 dark:border-gray-700">
                  Production
                </div>
                <div className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-medium text-text dark:text-white border border-gray-100 dark:border-gray-700">
                  Packaging
                </div>
                <div className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-medium text-text dark:text-white border border-gray-100 dark:border-gray-700">
                  +5 More
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 2: Vertical Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:row-span-2 bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 text-accent-hover">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-text dark:text-white mb-2">
                Cheapest Point Entry
              </h3>
              <p className="text-text-muted mb-8">
                Start smart, not expensive. Our AI finds the least-cost,
                high-impact entry point for your business.
              </p>

              <div className="mt-auto bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 transform group-hover:scale-105 transition-transform duration-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-muted">
                    Traditional Launch
                  </span>
                  <span className="text-xs font-bold text-red-500">$50k+</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <div className="w-full h-full bg-red-400 rounded-full" />
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-muted">
                    Elemental Launch
                  </span>
                  <span className="text-xs font-bold text-accent">$2k</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <div className="w-[10%] h-full bg-accent rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 3: Standard Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 group hover:shadow-2xl transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">
              Pivot & Fix Module
            </h3>
            <p className="text-text-muted text-sm">
              Stuck? Get 7 adjacent pivot options instantly. Turn a speaker
              brand into a rental service.
            </p>
          </motion.div>

          {/* Bento Item 4: Metric Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
          >
            <Sparkles className="w-8 h-8 mb-4 text-accent" />
            <div className="text-4xl font-bold mb-2 text-black dark:text-white">
              300%
            </div>
            <div className="text-sm text-text-muted">Faster Launch Speed</div>
          </motion.div>
        </div>
      </section>

      {/* The Architecture Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black dark:text-white">
              The Architecture
            </h2>
            <p className="text-text-muted">
              How Elemental AI dismantles and rebuilds your vision.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-4 h-auto md:h-[800px]">
          <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 relative overflow-hidden group hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h3 className="text-2xl font-bold mb-2 relative z-10 text-black dark:text-white">
              The Nucleus
            </h3>
            <p className="text-text-muted text-sm mb-8 relative z-10">
              Centralizing your raw idea before fission occurs.
            </p>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 border border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="w-48 h-48 border border-gray-300 dark:border-white/10 rounded-full absolute animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="w-64 h-64 border border-dashed border-gray-300 dark:border-white/10 rounded-full absolute animate-[spin_20s_linear_infinite]"></div>
              <div className="w-4 h-4 bg-primary rounded-full absolute shadow-[0_0_30px_rgba(89,65,255,1)]"></div>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-1 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col justify-between group">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-black dark:text-white">
                Instant Pivots
              </h4>
              <p className="text-xs text-text-muted mt-1">
                Identify 3 viable alternatives instantly.
              </p>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-1 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col justify-between group">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-black dark:text-white">
                Scale Vectors
              </h4>
              <p className="text-xs text-text-muted mt-1">
                Calculated paths to 10x revenue.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 md:row-span-1 rounded-3xl bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-800 p-6 font-mono text-xs overflow-hidden relative hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-50 dark:from-[#0a0a0c] to-transparent z-10"></div>
            <div className="opacity-70 dark:opacity-50">
              <p className="text-gray-500 dark:text-gray-500">
                // Elemental Analysis
              </p>
              <p className="text-primary">const</p>
              <p className="text-gray-900 dark:text-white inline">
                {" "}
                vision
              </p> = <p className="text-accent inline">"SaaS Platform"</p>;
              <br />
              <br />
              <p className="text-primary">function</p>
              <p className="text-yellow-600 dark:text-yellow-300 inline">
                {" "}
                deconstruct
              </p>
              (v) {"{"}
              <br />
              &nbsp;&nbsp;
              <p className="text-primary">return</p> v.elements.map(e ={">"}{" "}
              {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;optimize(e);
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;scale(e);
              <br />
              &nbsp;&nbsp;{"}"});
              <br />
              {"}"}
              <br />
              <br />
              <p className="text-gray-500 dark:text-gray-500">// Output:</p>
              <p className="text-gray-900 dark:text-white">
                {"> "}Opportunity Found: 94%
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 dark:from-[#0a0a0c] to-transparent z-10"></div>
          </div>

          <div className="md:col-span-4 md:row-span-1 rounded-3xl bg-gradient-to-r from-primary/20 to-accent/20 border border-gray-200 dark:border-gray-800 p-8 flex items-center justify-between relative overflow-hidden group hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
            <div className="relative z-10 max-w-lg">
              <h3 className="text-2xl font-bold mb-2 text-text dark:text-white">
                Hidden Opportunities
              </h3>
              <p className="text-text-muted text-sm">
                The EBM doesn't guess. It reveals the gaps in the market that
                your current model is missing.
              </p>
            </div>
            <div className="relative z-10">
              <button
                onClick={onStart}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute top-0 bottom-0 w-[1px] bg-white/20 left-0 animate-[marquee_5s_linear_infinite] opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Infinite Marquee */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text dark:text-white mb-4">
            Trusted by Builders
          </h2>
          <p className="text-xl text-text-muted">
            Join 10,000+ founders building with Elemental
          </p>
        </div>

        <div className="relative w-full mask-linear-fade">
          <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-8">
                {[
                  {
                    quote:
                      "I wanted to start a soap brand but had no capital. Elemental AI showed me I could start with soap-making training workshops instead.",
                    author: "Sarah Johnson",
                    role: "Entrepreneur",
                    company: "Soap Artistry",
                  },
                  {
                    quote:
                      "My loudspeaker business was dying. The AI revealed 7 pivot paths — I pivoted to speaker rental services and repairs.",
                    author: "Michael Chen",
                    role: "Manufacturer",
                    company: "SoundPro",
                  },
                  {
                    quote:
                      "I was stuck trying to raise funding. Elemental AI showed me 7 sub-businesses within it — I started with a free community.",
                    author: "Elena Rodriguez",
                    role: "Tech Founder",
                    company: "BuildSpace",
                  },
                  {
                    quote:
                      "The 'Cheapest Point Entry' feature saved me $40k. I launched my MVP in 2 weeks instead of 6 months.",
                    author: "David Kim",
                    role: "SaaS Founder",
                    company: "QuickLaunch",
                  },
                  {
                    quote:
                      "Finally a business tool that understands the chaos of starting up. The structure it provides is invaluable.",
                    author: "Jessica Lee",
                    role: "Creative Director",
                    company: "DesignFlow",
                  },
                ].map((t, i) => (
                  <div
                    key={`${setIndex}-${i}`}
                    className="w-[400px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex-shrink-0 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-text-muted text-lg mb-6 line-clamp-3">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {t.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-text dark:text-white">
                          {t.author}
                        </div>
                        <div className="text-xs text-text-muted">
                          {t.role} · {t.company}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-text tracking-tight dark:text-white">
              Start Where You Are.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                Grow Element by Element.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto">
              Let Elemental AI give structure to your dreams, direction to your
              ideas, and sustainability to your business — one element at a
              time.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="group px-10 py-5 bg-accent hover:bg-accent-hover text-black rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
            >
              Deconstruct My Business
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Watch Demo
            </motion.button>*/}
          </div> 

          {/* Trust Indicators */}
          <div className="space-y-4 pt-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                See all 7 sub-businesses
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Find your cheapest entry point
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Discover 7 pivot paths if stuck
              </span>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white dark:border-gray-900 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-muted">
                <span className="font-semibold text-text dark:text-white">
                  247 founders
                </span>{" "}
                started their analysis this week
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
