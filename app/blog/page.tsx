import { getAllPosts } from "@/lib/mdx";
import BlogClient from "./blog-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Formix",
  description:
    "Product updates, engineering deep dives, and thoughts on the future of headless architecture.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  return <BlogClient featuredPost={featuredPost} latestPosts={latestPosts} />;
}
