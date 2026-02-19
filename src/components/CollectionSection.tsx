import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CollectionItem {
  image: string;
  title: string;
  price: string;
  link: string;
}

interface CollectionSectionProps {
  title: string;
  items: CollectionItem[];
  bgColor?: string;
  viewAllLink?: string;
}

const CollectionSection = ({ title, items, bgColor = "bg-puniora-void", viewAllLink = "/products" }: CollectionSectionProps) => {
  return (
    <section className={`py-16 md:py-24 ${bgColor}`}>
      <div className="container mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl text-puniora-black mb-12 capitalize">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {items.map((item, index) => (
            <Link 
              key={index} 
              to={item.link}
              className="group flex flex-col items-center text-center"
            >
              {/* Arch Shaped Image Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-[10rem] rounded-b-lg mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                <div className="absolute inset-0 bg-puniora-orange/0 group-hover:bg-puniora-orange/10 transition-colors duration-300 z-10" />
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <h3 className="font-heading text-xl text-puniora-black mb-2 group-hover:text-puniora-orange transition-colors">
                {item.title}
              </h3>
              <p className="font-body text-sm font-medium text-gray-500 tracking-wide">
                {item.price}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
            <Link to={viewAllLink} className="inline-block relative">
                <span className="text-puniora-black font-bold uppercase tracking-widest text-sm border-b border-puniora-black hover:text-puniora-orange hover:border-puniora-orange transition-all pb-1">
                    View More
                </span>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
