"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Grid from "@/components/landing/ui/Grid";
import Separator from "@/components/landing/ui/Separator";
import { Post } from "@/lib/mdx";

export default function BlogClient({
  featuredPost,
  latestPosts,
}: {
  featuredPost: Post;
  latestPosts: Post[];
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative selection:bg-neutral-800 selection:text-white">
      <Grid />
      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 w-full pt-20">
        <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30 bg-[#0a0a0a]">
          {/* HEADER SECTION */}
          <div className="p-10 lg:p-16 border-b border-neutral-700/30 pt-16 lg:pt-24 text-center flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-mono text-white mb-4 tracking-tight"
            >
              Formix Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl"
            >
              Product updates, engineering deep dives, and thoughts on the
              future of headless architecture and data collection.
            </motion.p>
          </div>

          {/* FEATURED POST SECTION */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="p-6 md:p-10 lg:p-16 border-b border-neutral-700/30"
            >
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group flex flex-col lg:flex-row items-stretch bg-[#050505] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors"
              >
                {/* DYNAMIC FEATURED IMAGE */}
                <div
                  className={`w-full lg:w-1/2 aspect-[16/9] lg:aspect-auto bg-gradient-to-br ${featuredPost.meta.imageGradient || "from-neutral-800 to-neutral-950"} border-b lg:border-b-0 lg:border-r border-neutral-800 relative overflow-hidden`}
                >
                  {featuredPost.meta.coverImage ? (
                    <Image
                      src={featuredPost.meta.coverImage}
                      alt={featuredPost.meta.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                  )}
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 relative z-10 bg-[#050505]">
                  <div className="mb-4">
                    <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-neutral-800/80 border border-neutral-700/50 text-amber-400 rounded-md">
                      {featuredPost.meta.category}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight group-hover:text-neutral-300 transition-colors">
                    {featuredPost.meta.title}
                  </h2>

                  <p className="text-neutral-400 text-sm leading-relaxed mb-10 flex-1">
                    {featuredPost.meta.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-500 font-mono mt-auto pt-6 border-t border-neutral-800/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-neutral-300 font-sans text-sm font-medium">
                        {featuredPost.meta.author}
                      </span>
                      <span>{featuredPost.meta.role}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {featuredPost.meta.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {featuredPost.meta.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* LATEST POSTS SECTION */}
          {latestPosts.length > 0 && (
            <div className="p-6 md:p-10 lg:p-16 pb-20">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xl font-mono text-white mb-8 tracking-tight"
              >
                Latest Posts
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col h-full bg-[#050505] border border-neutral-800 hover:border-neutral-700 transition-colors rounded-xl p-8"
                    >
                      {/* DYNAMIC LATEST POST THUMBNAIL */}
                      {post.meta.coverImage ? (
                        <div className="w-full aspect-[16/9] mb-6 rounded-lg overflow-hidden relative border border-neutral-800">
                          <Image
                            src={post.meta.coverImage}
                            alt={post.meta.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      ) : null}

                      <div className="mb-5">
                        <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-md">
                          {post.meta.category}
                        </span>
                      </div>

                      <h4 className="text-xl font-medium text-white mb-3 group-hover:text-neutral-300 transition-colors line-clamp-2">
                        {post.meta.title}
                      </h4>

                      <p className="text-neutral-400 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
                        {post.meta.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-neutral-500 font-mono mt-auto">
                        <span>
                          {post.meta.date} • {post.meta.readTime}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-colors duration-300">
                          <ArrowRight
                            size={14}
                            className="text-neutral-400 group-hover:text-black transition-colors"
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col items-center relative z-10 bg-[#0a0a0a]">
          <div className="w-full h-px bg-neutral-700/30"></div>
          <div className="w-full max-w-300">
            <Separator />
          </div>
          <div className="w-full h-px bg-neutral-700/30"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
