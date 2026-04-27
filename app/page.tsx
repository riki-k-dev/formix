import Navbar from "@/components/landing/Navbar";
import Grid from "@/components/landing/ui/Grid";
import Hero from "@/components/landing/Hero";
import ImageSection from "@/components/landing/ImageSection";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import Separator from "@/components/landing/ui/Separator";
import SmoothScroll from "@/components/landing/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#0a0a0a] text-white relative flex flex-col items-center overflow-x-hidden">
        <Grid />
        <Navbar />
        <Hero />
        <ImageSection />
        <Problem />
        <Solution />
        <Features />
        <Pricing />
        <FAQ />

        <div className="w-full flex flex-col items-center relative z-10">
          <div className="w-full max-w-300">
            <Separator />
          </div>
          <div className="w-full h-px bg-neutral-700/30"></div>
        </div>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
