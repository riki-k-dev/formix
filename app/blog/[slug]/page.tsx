import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Grid from "@/components/landing/ui/Grid";
import Separator from "@/components/landing/ui/Separator";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: `${post.meta.title} | Formix Blog`,
      description: post.meta.excerpt,
    };
  } catch {
    return { title: "Post Not Found | Formix" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative selection:bg-neutral-800 selection:text-white">
      <Grid />
      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 w-full pt-20 pb-0 overflow-x-hidden">
        <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30 bg-[#0a0a0a] min-h-[calc(100vh-80px)]">
          {/* Post Header */}
          <div className="px-6 md:px-10 lg:px-24 py-16 lg:py-24 border-b border-neutral-700/30 text-left flex flex-col items-start">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm mb-10 font-medium"
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>

            <span className="px-3 py-1 mb-6 text-[10px] uppercase tracking-widest font-bold bg-neutral-900 border border-neutral-800 text-amber-400 rounded-md">
              {post.meta.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-medium text-white mb-8 tracking-tight max-w-4xl leading-tight">
              {post.meta.title}
            </h1>

            <div className="flex items-center justify-start gap-6 text-xs text-neutral-500 font-mono">
              <span className="text-neutral-300 font-sans text-sm font-medium">
                {post.meta.author}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {post.meta.date}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {post.meta.readTime}
              </span>
            </div>
          </div>

          {/* DYNAMIC HERO IMAGE */}
          <div className="w-full flex flex-col">
            {/* LINE 1*/}
            <div className="w-[100vw] h-px bg-neutral-700/30 relative left-1/2 -translate-x-1/2"></div>

            <div
              className={`w-full aspect-video md:aspect-[2/1] lg:aspect-[18/10] overflow-hidden bg-gradient-to-br ${post.meta.imageGradient || "from-neutral-800 to-neutral-950"} relative`}
            >
              {post.meta.coverImage ? (
                <Image
                  src={post.meta.coverImage}
                  alt={post.meta.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
              )}
            </div>

            {/* LINE 2 */}
            <div className="w-[100vw] h-px bg-neutral-700/30 relative left-1/2 -translate-x-1/2"></div>
          </div>

          {/* Markdown Content */}
          <article className="px-6 md:px-10 lg:px-24 py-16 w-full max-w-4xl prose prose-invert prose-neutral lg:prose-lg prose-headings:font-medium prose-a:text-amber-400 hover:prose-a:text-amber-300 prose-pre:border prose-pre:border-neutral-800 prose-pre:bg-[#050505] prose-img:rounded-xl">
            <MDXRemote source={post.content} />
          </article>
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
