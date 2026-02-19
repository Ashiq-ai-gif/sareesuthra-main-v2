import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToCollection = () => {
    if (window.location.pathname !== "/") {
      navigate("/products");
      return;
    }
    const element = document.getElementById("collection");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[90vh] flex items-center bg-puniora-void overflow-hidden pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-puniora-orange-50 to-transparent opacity-60 z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl z-0"></div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center h-full">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-in text-center md:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full border border-puniora-orange-500/20 bg-puniora-orange-50 text-puniora-orange-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
            New Collection 2026
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-puniora-orange">
            Effortless <br />
            <span className="italic text-puniora-black font-light">Elegance</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-lg mx-auto md:mx-0 leading-relaxed">
            Handpicked premium sarees for festive wear, weddings, and everyday elegance.
            Crafted for modern women with the soul of Indian tradition.
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
            <Button 
              onClick={scrollToCollection}
              className="bg-puniora-orange hover:bg-puniora-orange-600 text-white rounded-full h-14 px-8 text-sm uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full md:w-auto"
            >
              Shop Collection
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/products")}
              className="border-puniora-orange-200 text-puniora-orange-700 hover:bg-puniora-orange-50 rounded-full h-14 px-8 text-sm uppercase tracking-widest w-full md:w-auto"
            >
              View Collection <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* USPs */}
          <div className="pt-12 border-t border-puniora-orange-100 mt-8 flex flex-wrap gap-8 justify-center md:justify-start">
            {[
              "Authentic Zari",
              "Handwoven",
              "Pure Silk",
              "Crafted in India"
            ].map((usp, i) => (
              <div key={usp} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">{usp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image/Visual */}
        <div className="relative hidden md:block h-[80vh] w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
           <div className="absolute inset-0 bg-transparent z-10"></div>
           {/* Placeholder for Hero Image - ideally a model in a saree */}
           <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1610030469983-98e650e81f51?q=80&w=2070&auto=format&fit=crop" 
                alt="Elegant Saree Model" 
                loading="eager"
                decoding="async"
                fetchpriority="high"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 max-w-xs animate-float">
                <p className="font-heading text-2xl text-puniora-orange">Kanjivaram Silk</p>
                <p className="text-xs text-muted-foreground mt-1">Starting from ₹12,999</p>
              </div>
           </div>
           
           {/* Decorative circles */}
           <div className="absolute -right-12 top-1/4 w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center animate-spin-slow">
              <div className="w-20 h-20 rounded-full border border-gold/20"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
