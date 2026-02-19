import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Products = () => {
  return (
    <main className="min-h-screen bg-puniora-void">
      <Header />
      <div className="pt-28 md:pt-36">
        <ProductGrid />
      </div>
      <Footer />
      <SEO
        title="Shop Sarees"
        description="Explore Saree Sutra's curated collection of handpicked sarees across silk, festive, and everyday styles with Pan-India delivery."
        url="/products"
      />
    </main>
  );
};

export default Products;
