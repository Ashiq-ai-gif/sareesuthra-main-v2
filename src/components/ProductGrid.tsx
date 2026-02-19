import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, Check, SlidersHorizontal, X } from "lucide-react";
import { productService } from "@/lib/services/productService";
import { Product } from "@/lib/products";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

const ProductGrid = () => {
  useScrollReveal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicProducts = async () => {
      try {
        setLoading(true);
        const dynamicProducts = await productService.getProducts();
        setProducts((dynamicProducts || []).filter(p => !p.isHidden));
      } catch (error) {
        console.error("Failed to fetch products from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicProducts();
  }, []);

  // Filter State
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");
  // Sorting Options
  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Price, low to high", value: "price-asc" },
    { label: "Price, high to low", value: "price-desc" },
    { label: "Date, old to new", value: "date-asc" },
    { label: "Date, new to old", value: "date-desc" },
  ];

  // Logic
  const filteredProducts = products.filter(p => {
    // Category Filter
    let categoryMatch = true;
    if (activeCategory === "Men") categoryMatch = p.category === "Men" || p.category === "Unisex";
    else if (activeCategory === "Women") categoryMatch = p.category === "Women" || p.category === "Unisex";
    else if (activeCategory === "Unisex") categoryMatch = p.category === "Unisex";
    else if (activeCategory !== "All") categoryMatch = p.category === activeCategory;

    // Price Filter
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];

    return categoryMatch && priceMatch;
  });

  const displayProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "date-asc": return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case "date-desc": return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default: return 0; // Featured (default order)
    }
  });

  const categories = ["All", "Men", "Women", "Unisex"];

  return (
    <section id="collection" className="py-24 bg-puniora-void">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-on-scroll reveal opacity-0">
          <span className="text-xs uppercase tracking-[0.4em] text-puniora-orange-600 mb-4 block">
            Our Collection
          </span>
          <h2 className="font-heading text-3xl md:text-5xl mb-4 text-puniora-orange-DEFAULT">
            Handwoven Masterpieces
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 font-light">
            Each saree is a masterpiece, woven with the finest silk and zari
            to evoke grace, tradition, and timeless beauty.
          </p>
          
          {/* Filter & Sort Bar (Light Style) */}
          <div className="flex flex-row items-center justify-between gap-4 max-w-4xl mx-auto border-b border-puniora-orange-200/30 pb-4 mb-8">
             
             {/* LEFT: Filter Button (Opens Sheet) */}
             <Sheet>
                <SheetTrigger asChild>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest hover:border-puniora-orange-500 hover:text-puniora-orange-600 transition-all flex-1 md:flex-none justify-center shadow-sm">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-white border-r border-gray-100 w-[300px] md:w-[400px]">
                    <SheetHeader className="pb-6 border-b border-gray-100 text-left">
                        <SheetTitle className="text-puniora-orange-DEFAULT font-heading text-2xl">Filters</SheetTitle>
                    </SheetHeader>
                    
                    <div className="py-6 space-y-8">
                        {/* Sort Options */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-puniora-black uppercase tracking-wider">Sort By</h4>
                            <div className="flex flex-col gap-2">
                                {sortOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSortBy(option.value)}
                                        className={`flex items-center justify-between px-4 py-3 text-xs border rounded-lg transition-all ${
                                            sortBy === option.value 
                                            ? "bg-puniora-orange-50 text-puniora-orange-700 border-puniora-orange-200 font-bold" 
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black"
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        {sortBy === option.value && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <h4 className="font-bold text-puniora-black uppercase tracking-wider">Price Range</h4>
                                <span>₹{priceRange[0]} - ₹{priceRange[1]}+</span>
                            </div>
                            <Slider
                                defaultValue={[0, 5000]}
                                max={5000}
                                step={100}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="py-4"
                            />
                        </div>
                    </div>
                </SheetContent>
             </Sheet>

             {/* RIGHT: Browse Dropdown */}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest hover:border-puniora-orange-500 hover:text-puniora-orange-600 transition-all flex-1 md:flex-none justify-center md:min-w-[200px] justify-between shadow-sm">
                    <span>
                         {activeCategory === "All" ? "Shop All" : activeCategory} 
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[240px] bg-white/95 backdrop-blur-xl border border-gray-100 text-puniora-black p-2 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
                    
                    {/* Categories Section */}
                    <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                        Browse Collection
                    </div>
                    {categories.map(cat => (
                        <DropdownMenuItem 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`
                                cursor-pointer px-4 py-3 text-xs uppercase tracking-wider hover:bg-puniora-orange-50 focus:bg-puniora-orange-50 focus:text-puniora-orange-700 mb-1 rounded-md transition-colors
                                ${activeCategory === cat ? 'bg-puniora-orange-50 text-puniora-orange-700 font-bold' : 'text-gray-600'}
                            `}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span>{cat}</span>
                                {activeCategory === cat && <Check className="w-3.5 h-3.5 text-puniora-orange-600" />}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
             </DropdownMenu>

          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400 uppercase tracking-widest mb-4 px-2">
             <span>{filteredProducts.length} Products</span>
             {activeCategory !== "All" && (
                <button onClick={() => { setActiveCategory("All"); setPriceRange([0, 5000]); }} className="text-puniora-orange-500 hover:underline">
                    Clear Filters
                </button>
             )}
          </div>
        </div>

        {/* Product Grid */}
        {loading && products.length === 0 ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-puniora-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-24">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
            {!loading && displayProducts.length === 0 && (
              <div className="col-span-full py-24 text-center text-muted-foreground italic border border-dashed border-puniora-orange-200 rounded-3xl animate-fade-in bg-white/50">
                No sarees found matching your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
