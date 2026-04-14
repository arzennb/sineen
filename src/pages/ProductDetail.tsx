import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, ShoppingCart, Zap, ZoomIn } from "lucide-react";
import { useProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, getProductPrice } = useProducts();

  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [zoomed, setZoomed] = useState(false);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">المنتج غير موجود</h1>
        <Button asChild variant="outline"><Link to="/products">العودة للمنتجات</Link></Button>
      </div>
    );
  }

  const price = getProductPrice(product, selectedSize);
  const originalPrice = product.basePriceDZD;

  const handleAdd = () => {
    addItem(product, selectedSize, selectedColor);
    toast({ title: "تمت الإضافة ✓", description: `${product.name} أُضيف إلى السلة` });
  };

  const similar = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);


  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
      >
        <Link to="/" className="hover:text-accent transition-colors">الرئيسية</Link>
        <ArrowRight className="h-3 w-3 rotate-180" />
        <Link to="/products" className="hover:text-accent transition-colors">المنتجات</Link>
        <ArrowRight className="h-3 w-3 rotate-180" />
        <span className="text-foreground">{product.name}</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image with zoom */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div
            className={`aspect-[3/4] rounded-xl overflow-hidden bg-secondary cursor-zoom-in relative group ${
              zoomed ? "fixed inset-0 z-50 rounded-none aspect-auto cursor-zoom-out flex items-center justify-center bg-foreground/90" : ""
            }`}
            onClick={() => setZoomed(!zoomed)}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`${zoomed ? "max-h-[90vh] w-auto object-contain" : "w-full h-full object-cover"} transition-transform duration-500`}
            />
            {!zoomed && (
              <div className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4 text-foreground" />
              </div>
            )}
          </div>
          {product.discountPercent > 0 && !zoomed && (
            <div className="absolute top-4 left-4 gold-gradient text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-full">
              خصم {product.discountPercent}%
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-accent">{price.toLocaleString()} دج</span>
            {product.discountPercent > 0 && (
              <span className="text-lg text-muted-foreground line-through">{originalPrice.toLocaleString()} دج</span>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>

          <div className="bg-secondary/50 rounded-xl p-4">
            <h4 className="font-bold text-foreground mb-1">نوع القماش</h4>
            <p className="text-muted-foreground">{product.fabricType}</p>
          </div>


          {/* Size */}
          <div>
            <h4 className="font-bold text-foreground mb-3">المقاس</h4>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedSize(s)}
                  className={`w-14 h-14 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                    selectedSize === s
                      ? "gold-gradient text-accent-foreground border-transparent shadow-md"
                      : "border-border text-foreground hover:border-accent"
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h4 className="font-bold text-foreground mb-3">اللون</h4>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <motion.button
                  key={c}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColor(c)}
                  className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                    selectedColor === c
                      ? "gold-gradient text-accent-foreground border-transparent shadow-md"
                      : "border-border text-foreground hover:border-accent"
                  }`}
                >
                  {c}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="w-full gold-gradient border-0 text-foreground font-bold text-base" onClick={handleAdd}>
                <ShoppingCart className="ml-2 h-5 w-5" />
                أضف إلى السلة
              </Button>
            </motion.div>
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
                <Link to="/checkout" onClick={handleAdd}>
                  <Zap className="ml-2 h-5 w-5" />
                  اشترِ الآن
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="bg-secondary rounded-xl p-4">
            <h4 className="font-bold text-foreground mb-1">تعليمات الغسيل</h4>
            <p className="text-sm text-muted-foreground">{product.washInstructions}</p>
          </div>
        </motion.div>
      </div>

      {similar.length > 0 && (
        <motion.section
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">منتجات مشابهة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
