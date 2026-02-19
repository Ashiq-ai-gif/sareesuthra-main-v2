import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import OurStorySection from "@/components/OurStorySection";

import { SEO } from "@/components/SEO";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const Index = () => {
  return (
    <main className="min-h-screen relative overflow-hidden bg-puniora-void">
      <div className="relative z-10">
        <Header />
        <RevealOnScroll variant="fade-in" duration={1000}>
          <Hero />
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delay={200}>
          <ProductGrid />
        </RevealOnScroll>

        {/* Our Story */}
        <RevealOnScroll variant="fade-up" delay={300}>
          <OurStorySection />
        </RevealOnScroll>
        
        <Footer />

        <SEO
          title="Premium Sarees Online"
          description="Shop premium sarees online at Saree Sutra. Discover wedding, festive, silk, and everyday drapes with trusted quality and Pan-India delivery."
          url="/"
        />
      </div>
    </main>
  );
};

export default Index;
