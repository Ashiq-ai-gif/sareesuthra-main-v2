import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Heart, Award, Users, Target, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const About = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-6">
                            <Sparkles className="h-8 w-8 text-gold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading mb-4">About Saree Sutra</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Weaving traditions into timeless elegance
                        </p>
                    </div>

                    <div className="prose prose-lg max-w-none space-y-8 animate-slide-up">
                        <section className="glass p-8 rounded-3xl space-y-4">
                            <h2 className="text-3xl font-heading text-center mb-6">Our Story</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Saree Sutra was born from a deep-rooted love for Indian heritage and the art of draping. We believe that a saree is more than just a garment—it's a canvas of culture, a legacy passed down through generations, and a celebration of womanhood.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Founded with the vision of reviving traditional weaves while embracing contemporary aesthetics, we curate sarees for weddings, festive occasions, and modern daily elegance. Each piece in our collection reflects artisan skill, trusted quality, and wearable luxury.
                            </p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass p-6 rounded-2xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 bg-gold/10 rounded-xl flex items-center justify-center">
                                        <Target className="h-6 w-6 text-gold" />
                                    </div>
                                    <h3 className="text-xl font-heading m-0">Our Mission</h3>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed m-0">
                                    To preserve and promote the rich heritage of Indian handlooms by making authentic, high-quality sarees accessible to women across the globe.
                                </p>
                            </div>

                            <div className="glass p-6 rounded-2xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 bg-gold/10 rounded-xl flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-gold" />
                                    </div>
                                    <h3 className="text-xl font-heading m-0">Our Vision</h3>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed m-0">
                                    To be the global destination for luxury Indian ethnic wear, recognized for our commitment to authenticity, craftsmanship, and sustainable fashion.
                                </p>
                            </div>
                        </div>

                        <section className="glass p-8 rounded-3xl space-y-6 bg-gold/5 border border-gold/20">
                            <h2 className="text-2xl font-heading text-center">What Sets Us Apart</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center space-y-3">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 rounded-full">
                                        <Award className="h-7 w-7 text-gold" />
                                    </div>
                                    <h3 className="font-bold">Authentic Weaves</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Directly sourced from artisans to ensure purity and authenticity
                                    </p>
                                </div>

                                <div className="text-center space-y-3">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 rounded-full">
                                        <Heart className="h-7 w-7 text-gold" />
                                    </div>
                                    <h3 className="font-bold">Customer Love</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Dedicated to providing an exceptional shopping experience
                                    </p>
                                </div>

                                <div className="text-center space-y-3">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 rounded-full">
                                        <Leaf className="h-7 w-7 text-gold" />
                                    </div>
                                    <h3 className="font-bold">Sustainable</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Supporting weaver communities and eco-friendly practices
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="glass p-8 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="h-6 w-6 text-gold" />
                                <h2 className="text-2xl font-heading m-0">Our Values</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-2 h-2 bg-gold rounded-full mt-2"></div>
                                    <div>
                                        <h3 className="font-bold mb-1">Tradition</h3>
                                        <p className="text-sm text-muted-foreground m-0">
                                            Honoring the age-old techniques and artistry of Indian handlooms.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-2 h-2 bg-gold rounded-full mt-2"></div>
                                    <div>
                                        <h3 className="font-bold mb-1">Quality</h3>
                                        <p className="text-sm text-muted-foreground m-0">
                                            Uncompromising standards in fabric, zari, and craftsmanship.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-2 h-2 bg-gold rounded-full mt-2"></div>
                                    <div>
                                        <h3 className="font-bold mb-1">Transparency</h3>
                                        <p className="text-sm text-muted-foreground m-0">
                                            Fair pricing and honest representation of our products.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-2 h-2 bg-gold rounded-full mt-2"></div>
                                    <div>
                                        <h3 className="font-bold mb-1">Innovation</h3>
                                        <p className="text-sm text-muted-foreground m-0">
                                            Blending traditional designs with modern sensibilities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="glass p-8 rounded-3xl space-y-4">
                            <h2 className="text-2xl font-heading">Our Collection</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                From the grandeur of Kanjivaram to the delicacy of Chanderi, our collection celebrates the diversity of Indian drapes. Whether it's a bridal trousseau or a festive celebration, Saree Sutra has the perfect six yards of elegance for you.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-muted/20 p-4 rounded-xl border border-border/50 text-center">
                                    <p className="text-2xl font-heading text-gold mb-1">Silk Sarees</p>
                                    <p className="text-xs text-muted-foreground">Kanjivaram, Banarasi & More</p>
                                </div>
                                <div className="bg-muted/20 p-4 rounded-xl border border-border/50 text-center">
                                    <p className="text-2xl font-heading text-gold mb-1">Cotton Sarees</p>
                                    <p className="text-xs text-muted-foreground">Comfort & Grace</p>
                                </div>
                                <div className="bg-muted/20 p-4 rounded-xl border border-border/50 text-center">
                                    <p className="text-2xl font-heading text-gold mb-1">Designer</p>
                                    <p className="text-xs text-muted-foreground">Contemporary & Chic</p>
                                </div>
                            </div>
                        </section>

                        <section className="glass p-8 rounded-3xl space-y-4 text-center">
                            <h2 className="text-2xl font-heading">Join Our Journey</h2>
                            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                Thank you for choosing Saree Sutra. We're honored to be part of your celebrations. Every fold, every drape, every moment—woven with love, delivered with care.
                            </p>
                            <div className="pt-4">
                                <Link to="/products" className="inline-flex items-center justify-center px-8 py-3 bg-gold hover:bg-gold/90 text-white rounded-full font-bold transition-colors">
                                    Explore Our Collection
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
            <SEO
                title="About Us"
                description="Learn about Saree Sutra's journey, values, and commitment to premium sarees, trusted quality, and Indian craftsmanship."
                url="/about"
            />
        </div>
    );
};

export default About;
