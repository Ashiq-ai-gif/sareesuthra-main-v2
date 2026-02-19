import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Product, ProductSection } from "@/lib/products";
import { productService } from "@/lib/services/productService";
import { toast } from "sonner";
import { Loader2, ImagePlus, Upload, X, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import AdminReviewManager from "./AdminReviewManager";
import { getDirectUrl } from "@/lib/utils/imageUtils";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.enum(["Men", "Women", "Unisex"]),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  real_price: z.coerce.number().optional(),
  size: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  isGiftSet: z.boolean().default(false),
  fabric: z.string().optional(),
  weave: z.string().optional(),
  blouseDetail: z.string().optional(),
  washCare: z.string().optional(),
  color: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

const ProductForm = ({ isOpen, onClose, onSuccess, product }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  // Gallery State
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  // Rich Olfactory Notes State - Moved above to be primary


  // Extra Sections State
  const [extraSections, setExtraSections] = useState<ProductSection[]>([]);

  // Variants State
  const [variants, setVariants] = useState<{ id: string; size: string; price: number; existingImage?: string }[]>([]);

  // Videos State
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [currentVideoInput, setCurrentVideoInput] = useState("");

  // Gift Bundle State
  const [selectedBundleItems, setSelectedBundleItems] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products for bundling selection
    const loadProducts = async () => {
      const data = await productService.getProducts();
      if (data) {
        // Filter out gift sets to avoid infinite nesting loop if needed, 
        // or just allow everything. Let's filter out current product to avoid self-reference.
        setAvailableProducts(data.filter(p => !p.isGiftSet && (product ? p.id !== product.id : true)));
      }
    };
    loadProducts();
  }, [product]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "Women", // Default to Women for Sarees
      price: 1299,
      real_price: 1599,
      size: "Free Size",
      description: "",
      images: [],
      gallery: [],
      isGiftSet: false,
      fabric: "",
      weave: "",
      blouseDetail: "Unstitched Blouse Piece",
      washCare: "Dry Clean Only",
      color: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        category: product.category,
        price: product.price,
        real_price: product.real_price || product.price + 300,
        size: product.size || "Free Size",
        description: product.description,
        images: product.images,
        gallery: product.gallery || [],
        isGiftSet: !!product.isGiftSet,
        fabric: product.fabric || "",
        weave: product.weave || "",
        blouseDetail: product.blouseDetail || "Unstitched Blouse Piece",
        washCare: product.washCare || "Dry Clean Only",
        color: product.color || "",
      });
      setExistingImages(product.images);
      setExistingGalleryImages(product.gallery || []);

      if (product.videos) {
        setVideoLinks(product.videos);
      } else {
        setVideoLinks([]);
      }

      if (product.extraSections) {
        setExtraSections(product.extraSections);
      } else {
        setExtraSections([]);
      }
    } else {
      form.reset({
        name: "",
        category: "Women",
        price: 2500,
        real_price: 3500,
        size: "Free Size",
        description: "",
        images: [],
        gallery: [],
        isGiftSet: false,
        fabric: "",
        weave: "",
        blouseDetail: "Unstitched Blouse Piece",
        washCare: "Dry Clean Only",
        color: "",
      });
      setExistingImages([]);
      setExistingGalleryImages([]);
      setVideoLinks([]);
      setExtraSections([]);
    }
  }, [product, form, isOpen]);

  const validateUrl = (url: string): string | null => {
    if (url.includes("ibb.co") && !url.includes("i.ibb.co")) {
      return "You pasted an ImgBB Viewer Link. Please copy the 'Direct Link' (ending in .jpg/.png) instead.";
    }
    return null;
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const validationError = validateUrl(imageUrlInput.trim());
    if (validationError) {
      toast.warning("Invalid Link Format", { description: validationError });
      return;
    }
    const directUrl = getDirectUrl(imageUrlInput.trim());
    setExistingImages(prev => [...prev, directUrl]);
    setImageUrlInput("");
    toast.success("Image URL added");
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    const directUrl = getDirectUrl(galleryUrlInput.trim());
    setExistingGalleryImages(prev => [...prev, directUrl]);
    setGalleryUrlInput("");
    toast.success("Gallery URL added");
  };

  const removeGalleryImage = (index: number) => {
    setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (
    files: FileList | null,
    target: "main" | "gallery"
  ) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    if (target === "main") setUploadingMain(true);
    if (target === "gallery") setUploadingGallery(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of fileArray) {
        const url = await productService.uploadImage(file);
        uploadedUrls.push(url);
      }

      if (target === "main") {
        setExistingImages(prev => [...prev, ...uploadedUrls]);
      } else {
        setExistingGalleryImages(prev => [...prev, ...uploadedUrls]);
      }

      toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} uploaded`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Image upload failed");
    } finally {
      if (target === "main") setUploadingMain(false);
      if (target === "gallery") setUploadingGallery(false);
    }
  };

  const addVideoLink = () => {
    if (currentVideoInput && currentVideoInput.trim() !== "") {
      setVideoLinks(prev => [...prev, currentVideoInput.trim()]);
      setCurrentVideoInput("");
    }
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks(prev => prev.filter((_, i) => i !== index));
  };

  const addSection = () => {
    setExtraSections(prev => [...prev, { title: "", content: "" }]);
  };

  const removeSection = (index: number) => {
    setExtraSections(prev => prev.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof ProductSection, value: string) => {
    setExtraSections(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);

      const finalImages = [...existingImages];
      const finalGalleryImages = [...existingGalleryImages];

      if (finalImages.length === 0) {
        toast.error("Please add at least one image");
        setLoading(false);
        return;
      }

      const formattedValues = {
        ...values,
        images: finalImages,
        gallery: finalGalleryImages,
        videos: videoLinks,
        extraSections: extraSections.filter(s => s.title.trim() !== "" && s.content.trim() !== ""),
      };

      if (product) {
        await productService.updateProduct(product.id, formattedValues as Partial<Product>);
        toast.success("Product updated successfully");
      } else {
        await productService.addProduct(formattedValues as Omit<Product, "id">);
        toast.success("Product added successfully");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Form Submission Error:", error);
      toast.error(error.message || (product ? "Failed to update product" : "Failed to add product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            Add product details, image links, gallery, and optional extra sections.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Traditional Kanjivaram Silk Saree" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Women">Women</SelectItem>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Saree Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                <FormField
                  control={form.control}
                  name="fabric"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Fabric</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Pure Silk, Cotton" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Weave Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Handwoven, Jacquard" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Maroon, Gold" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blouseDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Blouse Details</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Unstitched piece included" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="washCare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Wash Care</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dry Clean Only" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Free Size" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            {/* Price section */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="real_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Real Price (MRP)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold font-bold">Special Price (Selling)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="border-gold/50 bg-gold/5" />
                    </FormControl>
                    {form.watch("real_price") && form.watch("price") && form.watch("real_price")! > form.watch("price") && (
                      <p className="text-[10px] text-green-600 font-bold mt-1">
                        {Math.round(((form.watch("real_price")! - form.watch("price")) / form.watch("real_price")!) * 100)}% OFF
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                       placeholder="Describe the saree, its origin, and patterns..." 
                       {...field} 
                       className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="space-y-2">
              <Label>Main Product Images</Label>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste direct image link"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddImageUrl} variant="secondary">
                    Add URL
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground">
                  You can paste direct links or upload files from your device.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-2">
                {/* Existing Images (URLs) */}
                {existingImages.map((preview, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square rounded-md overflow-hidden border border-border group">
                    <img src={getDirectUrl(preview)} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-gold/80 text-white text-[8px] py-0.5 text-center uppercase tracking-tighter">
                        Main
                      </div>
                    )}
                  </div>
                ))}



                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-muted-foreground/25 rounded-md bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => uploadFiles(e.target.files, "main")}
                    disabled={uploadingMain}
                  />
                  <div className="flex flex-col items-center justify-center text-muted-foreground/80">
                    {uploadingMain ? <Loader2 className="h-5 w-5 mb-1 animate-spin" /> : <Upload className="h-5 w-5 mb-1" />}
                    <p className="text-[10px] text-center px-1">{uploadingMain ? "Uploading..." : "Upload Images"}</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Product Gallery Section */}
            <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-dashed border-gold/30">
              <Label className="text-gold font-bold uppercase tracking-wider text-xs">Product Gallery (Masonry Layout)</Label>

              <div className="flex flex-col gap-3">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-widest">Add from Main Images</Label>
                {existingImages.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">No main images available to select.</p>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {/* Existing Main Images */}
                    {existingImages.map((img, idx) => {
                      const isAlreadyInGallery = existingGalleryImages.includes(img);
                      return (
                        <div
                          key={`select-main-${idx}`}
                          className={`relative w-12 h-12 shrink-0 rounded border cursor-pointer transition-all ${isAlreadyInGallery ? 'border-gold opacity-50' : 'border-border hover:border-gold'
                            }`}
                          onClick={() => {
                            if (!isAlreadyInGallery) {
                              setExistingGalleryImages(prev => [...prev, img]);
                              toast.success("Image added to gallery");
                            }
                          }}
                        >
                          <img src={getDirectUrl(img)} className="w-full h-full object-cover rounded-[3px]" />
                          {isAlreadyInGallery && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Or paste external image link..."
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGalleryUrl())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddGalleryUrl} variant="secondary">
                    Add URL
                  </Button>
                </div>
              </div>

              {/* Custom Grid Layout for Gallery Preview */}
              <div className="grid grid-cols-4 gap-2 auto-rows-[100px]">
                {/* Render Existing Gallery Images */}
                {existingGalleryImages.map((preview, index) => (
                  <div
                    key={`exist-gal-${index}`}
                    className={`relative rounded-md overflow-hidden border border-border group ${index % 5 === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                      }`}
                  >
                    <img src={getDirectUrl(preview)} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}



                <label className="flex flex-col items-center justify-center col-span-1 row-span-1 border-2 border-dashed border-muted-foreground/25 rounded-md bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => uploadFiles(e.target.files, "gallery")}
                    disabled={uploadingGallery}
                  />
                  {uploadingGallery ? (
                    <Loader2 className="h-5 w-5 text-muted-foreground/80 mb-1 animate-spin" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-muted-foreground/80 mb-1" />
                  )}
                  <span className="text-[9px] text-muted-foreground/80 text-center">
                    {uploadingGallery ? "Uploading..." : "Upload"}
                  </span>
                </label>
              </div>
            </div>

            {/* Extra Sections (Accordion Data) */}
            <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-dashed border-gold/30">
              <div className="flex items-center justify-between">
                <Label className="text-gold font-bold uppercase tracking-wider text-xs">Additional Information (Accordion)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addSection} className="h-7 text-xs gap-1 border-gold/50 text-gold hover:bg-gold hover:text-white">
                  <Plus className="h-3 w-3" /> Add Section
                </Button>
              </div>

              {extraSections.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-2">
                  Add "How to Use", "Ingredients", or "Benefits" sections here.
                </p>
              ) : (
                <div className="space-y-3">
                  {extraSections.map((section, idx) => (
                    <div key={idx} className="bg-background p-3 rounded-lg border border-border space-y-2 relative group">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeSection(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Section Title</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(idx, 'title', e.target.value)}
                          placeholder="e.g. How to Use"
                          className="h-8 font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Content</Label>
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateSection(idx, 'content', e.target.value)}
                          placeholder="Details about this section..."
                          className="min-h-[60px] text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Product Videos <span className="text-muted-foreground font-normal ml-1 text-xs">(Optional)</span></Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste video link (MP4 URL, etc.)"
                  value={currentVideoInput}
                  onChange={(e) => setCurrentVideoInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={addVideoLink} variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                  Add Link
                </Button>
              </div>

              {videoLinks.length > 0 && (
                <div className="space-y-2 bg-muted/20 p-3 rounded-lg border border-border">
                  {videoLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between bg-background p-2 rounded border border-border/50">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xs bg-gold/10 text-gold px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Video {index + 1}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[300px]">{link}</span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeVideoLink(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>





            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the scent profile and story..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gift Set Configuration */}
            <div className="space-y-4 rounded-xl border border-border p-4 bg-muted/10">
              <FormField
                control={form.control}
                name="isGiftSet"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-bold">Gift Set / Bundle</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Is this product a collection of other items?
                      </p>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("isGiftSet") && (
                <div className="animate-fade-in space-y-4 pt-2 border-t border-border/50">
                  <div className="space-y-3">
                    <Label>Select Products in this Bundle</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                      {/* We need to fetch all products to list them here. 
                          For now, we rely on a passed prop or context, 
                          but since we don't have it easily, we might need to fetch it or 
                          assume the parent passed it. 
                          
                          Actually, better to fetch locally in this component if needed or receive it.
                          Let's assume we can fetch listing for selection.
                       */}
                      <p className="col-span-2 text-xs text-muted-foreground italic">
                        Select items to include in this bundle to automatically calculate savings.
                      </p>
                      {availableProducts.map((p) => (
                        <div key={p.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`bundle-${p.id}`}
                            checked={selectedBundleItems.includes(p.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBundleItems(prev => [...prev, p.id]);
                              } else {
                                setSelectedBundleItems(prev => prev.filter(id => id !== p.id));
                              }
                            }}
                          />
                          <Label htmlFor={`bundle-${p.id}`} className="text-sm cursor-pointer truncate">
                            {p.name} <span className="text-muted-foreground text-xs">({p.price})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedBundleItems.length > 0 && (
                    <div className="bg-gold/10 p-3 rounded-lg flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Value:</span>
                      <span className="font-bold text-gold">
                        ₹{availableProducts.filter(p => selectedBundleItems.includes(p.id)).reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Review Manager (Only in Edit Mode) */}
            {product?.id && (
              <div className="space-y-3 pt-6 border-t border-gold/20">
                <AdminReviewManager productId={product.id} />
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-gold hover:bg-gold/90 text-white min-w-[100px]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : product ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
