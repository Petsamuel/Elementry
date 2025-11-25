import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  HelpCircle,
  Sparkles,
  Send,
  FileText,
  AlertCircle,
  Lightbulb,
  Upload,
  CheckCircle2,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState("feature");
  const [featureData, setFeatureData] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  });
  const [ticketData, setTicketData] = useState({
    type: "",
    urgency: "",
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate random particles for background
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Feature request submitted successfully!");
    setFeatureData({ title: "", category: "", priority: "", description: "" });
    setIsSubmitting(false);
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Support ticket created successfully!");
    setTicketData({ type: "", urgency: "", subject: "", description: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-accent/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Radial Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(200,255,22,0.1),transparent_70%)] pointer-events-none" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-12"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            className="p-4 rounded-2xl bg-linear-to-br from-accent/20 to-primary/20 backdrop-blur-sm border border-accent/20"
            animate={{
              boxShadow: [
                "0 0 20px rgba(200, 255, 22, 0.2)",
                "0 0 40px rgba(200, 255, 22, 0.4)",
                "0 0 20px rgba(200, 255, 22, 0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <HelpCircle className="w-12 h-12 text-accent" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-white to-gray-400">
            Help Center
          </h1>

          <p className="text-text-muted text-lg max-w-2xl">
            We're here to help! Request new features or get support for any
            issues you're experiencing.
          </p>
        </div>
      </motion.div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <div className="bg-obsidian/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-accent/20 via-primary/20 to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            {/* Tab List */}
            <div className="border-b border-white/10 bg-black/20 p-2">
              <Tabs.List className="flex gap-2">
                <Tabs.Trigger
                  value="feature"
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all data-[state=active]:bg-accent data-[state=active]:text-black text-gray-400 hover:text-white flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Feature Request
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="ticket"
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all data-[state=active]:bg-accent data-[state=active]:text-black text-gray-400 hover:text-white flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Support Ticket
                </Tabs.Trigger>
              </Tabs.List>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Feature Request Tab */}
              <Tabs.Content value="feature" className="outline-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="feature"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-accent" />
                        Request a Feature
                      </h2>
                      <p className="text-gray-400">
                        Have an idea to make Elementry better? We'd love to hear
                        it!
                      </p>
                    </div>

                    <form onSubmit={handleFeatureSubmit} className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                          Feature Title
                        </label>
                        <input
                          type="text"
                          value={featureData.title}
                          onChange={(e) =>
                            setFeatureData({
                              ...featureData,
                              title: e.target.value,
                            })
                          }
                          placeholder="Brief title for your feature request"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none transition-all"
                          required
                        />
                      </div>

                      {/* Category and Priority */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                            Category
                          </label>
                          <select
                            value={featureData.category}
                            onChange={(e) =>
                              setFeatureData({
                                ...featureData,
                                category: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none transition-all cursor-pointer"
                            required
                          >
                            <option value="" className="bg-[#0A0A0A]">
                              Select category...
                            </option>
                            <option
                              value="enhancement"
                              className="bg-[#0A0A0A]"
                            >
                              Enhancement
                            </option>
                            <option
                              value="new-feature"
                              className="bg-[#0A0A0A]"
                            >
                              New Feature
                            </option>
                            <option
                              value="integration"
                              className="bg-[#0A0A0A]"
                            >
                              Integration
                            </option>
                            <option value="ui-ux" className="bg-[#0A0A0A]">
                              UI/UX
                            </option>
                            <option value="other" className="bg-[#0A0A0A]">
                              Other
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                            Priority
                          </label>
                          <select
                            value={featureData.priority}
                            onChange={(e) =>
                              setFeatureData({
                                ...featureData,
                                priority: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none transition-all cursor-pointer"
                            required
                          >
                            <option value="" className="bg-[#0A0A0A]">
                              Select priority...
                            </option>
                            <option value="low" className="bg-[#0A0A0A]">
                              Low
                            </option>
                            <option value="medium" className="bg-[#0A0A0A]">
                              Medium
                            </option>
                            <option value="high" className="bg-[#0A0A0A]">
                              High
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                          Detailed Description
                        </label>
                        <textarea
                          value={featureData.description}
                          onChange={(e) =>
                            setFeatureData({
                              ...featureData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe your feature request in detail. What problem does it solve? How would it work?"
                          className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none resize-none transition-all"
                          required
                        />
                      </div>

                      {/* File Upload Placeholder */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                          Attachments (Optional)
                        </label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-accent/30 transition-all cursor-pointer group">
                          <Upload className="w-8 h-8 text-gray-500 group-hover:text-accent transition-colors mx-auto mb-2" />
                          <p className="text-sm text-gray-500 group-hover:text-gray-400">
                            Click to upload mockups or screenshots
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary h-14 text-lg font-bold flex items-center justify-center gap-3 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Zap className="w-5 h-5" />
                            </motion.div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit Feature Request
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                </AnimatePresence>
              </Tabs.Content>

              {/* Support Ticket Tab */}
              <Tabs.Content value="ticket" className="outline-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="ticket"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-accent" />
                        Open a Support Ticket
                      </h2>
                      <p className="text-gray-400">
                        Experiencing an issue? Let us know and we'll help you
                        resolve it.
                      </p>
                    </div>

                    <form onSubmit={handleTicketSubmit} className="space-y-6">
                      {/* Issue Type and Urgency */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                            Issue Type
                          </label>
                          <select
                            value={ticketData.type}
                            onChange={(e) =>
                              setTicketData({
                                ...ticketData,
                                type: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none transition-all cursor-pointer"
                            required
                          >
                            <option value="" className="bg-[#0A0A0A]">
                              Select type...
                            </option>
                            <option value="bug" className="bg-[#0A0A0A]">
                              Bug Report
                            </option>
                            <option value="question" className="bg-[#0A0A0A]">
                              Question
                            </option>
                            <option value="account" className="bg-[#0A0A0A]">
                              Account Issue
                            </option>
                            <option value="billing" className="bg-[#0A0A0A]">
                              Billing
                            </option>
                            <option value="other" className="bg-[#0A0A0A]">
                              Other
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                            Urgency
                          </label>
                          <select
                            value={ticketData.urgency}
                            onChange={(e) =>
                              setTicketData({
                                ...ticketData,
                                urgency: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none transition-all cursor-pointer"
                            required
                          >
                            <option value="" className="bg-[#0A0A0A]">
                              Select urgency...
                            </option>
                            <option value="low" className="bg-[#0A0A0A]">
                              Low
                            </option>
                            <option value="medium" className="bg-[#0A0A0A]">
                              Medium
                            </option>
                            <option value="high" className="bg-[#0A0A0A]">
                              High
                            </option>
                            <option value="critical" className="bg-[#0A0A0A]">
                              Critical
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={ticketData.subject}
                          onChange={(e) =>
                            setTicketData({
                              ...ticketData,
                              subject: e.target.value,
                            })
                          }
                          placeholder="Brief summary of your issue"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none transition-all"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                          Description
                        </label>
                        <textarea
                          value={ticketData.description}
                          onChange={(e) =>
                            setTicketData({
                              ...ticketData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Please provide as much detail as possible about your issue, including steps to reproduce if applicable."
                          className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none resize-none transition-all"
                          required
                        />
                      </div>

                      {/* File Upload Placeholder */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                          Attachments (Optional)
                        </label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-accent/30 transition-all cursor-pointer group">
                          <Upload className="w-8 h-8 text-gray-500 group-hover:text-accent transition-colors mx-auto mb-2" />
                          <p className="text-sm text-gray-500 group-hover:text-gray-400">
                            Click to upload screenshots or error logs
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            PNG, JPG, PDF, TXT up to 10MB
                          </p>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary h-14 text-lg font-bold flex items-center justify-center gap-3 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Zap className="w-5 h-5" />
                            </motion.div>
                            Creating Ticket...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Submit Support Ticket
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                </AnimatePresence>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-2xl bg-obsidian/50 border border-white/5 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Response Time
            </h3>
            <p className="text-gray-400 text-sm">
              We typically respond to feature requests within 48 hours and
              support tickets within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="p-6 rounded-2xl bg-obsidian/50 border border-white/5 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              Track Your Request
            </h3>
            <p className="text-gray-400 text-sm">
              You'll receive email updates about your submission. Check your
              inbox for confirmation and status updates.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
