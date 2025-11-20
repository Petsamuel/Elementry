import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";

export default function BlogPage() {
  const posts = [
    {
      title: "The Art of Business Deconstruction",
      excerpt:
        "Learn how to break down complex business models into manageable elements for better analysis and execution.",
      author: "Utibe Okuk",
      date: "Nov 15, 2023",
      category: "Strategy",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "AI in Modern Entrepreneurship",
      excerpt:
        "How artificial intelligence is reshaping the way we validate ideas and build startups in 2024.",
      author: "Team Elemental",
      date: "Nov 10, 2023",
      category: "Technology",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Finding Your Minimum Viable Segment",
      excerpt:
        "Stop trying to sell to everyone. Discover how to identify and dominate your initial niche market.",
      author: "Utibe Okuk",
      date: "Nov 05, 2023",
      category: "Growth",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <ParticleBackground />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-3xl mx-auto pt-10"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text dark:text-white">
            Latest <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-text to-primary animate-gradient-x dark:via-white">
              Insights
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted leading-relaxed font-light">
            Thoughts on business strategy, AI, and growth from the Elemental
            team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group cursor-pointer border-white/5 hover:border-accent/30 hover:bg-white/10 transition-all duration-300"
            >
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent z-10" />
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 z-20 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-lg">
                  {post.category}
                </span>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-4 text-xs text-text-muted font-medium uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-accent" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-accent" />
                    {post.date}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-text dark:text-white group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-text-muted text-base line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-accent text-sm font-bold pt-4">
                  Read Article{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
