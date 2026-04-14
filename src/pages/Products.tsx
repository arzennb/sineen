import { useState } from "react";
import { useProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

export default function Products() {
  const { products, categories, fabrics } = useProducts();
  const [category, setCategory] = useState("الكل");
  const [fabric, setFabric] = useState("الكل");
  const [showFilters, setShowFilters] = useState(false);

  // Note: Customers page uses 'fabric' from products-store which maps to 'fabricType' in dynamic system
  const filtered = products.filter((p) => {
    const catMatch = category === "الكل" || p.category === category;
    const fabMatch = fabric === "الكل" || p.fabricType === fabric;
    return catMatch && fabMatch;
  });

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">المنتجات</h1>
        <p className="text-muted-foreground mb-8">تصفح تشكيلتنا الكاملة من العباءات الرجالية</p>
      </motion.div>

      {/* Filter toggle for mobile */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium"
      >
        <SlidersHorizontal className="h-4 w-4" />
        فلترة المنتجات
      </button>

      {/* Filters */}
      <motion.div
        className={`space-y-4 mb-8 ${showFilters ? "block" : "hidden md:block"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <span className="text-sm font-medium text-foreground mb-2 block">التصنيف</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === c
                    ? "gold-gradient text-accent-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/10 hover:border-accent"
                }`}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-foreground mb-2 block">القماش</span>
          <div className="flex flex-wrap gap-2">
            {fabrics.map((f) => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFabric(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  fabric === f
                    ? "gold-gradient text-accent-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        {(category !== "الكل" || fabric !== "الكل") && (
          <button
            onClick={() => { setCategory("الكل"); setFabric("الكل"); }}
            className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            <X className="h-3 w-3" />
            إزالة الفلاتر
          </button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category + fabric}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground py-16"
        >
          لا توجد منتجات تطابق الفلاتر المحددة
        </motion.p>
      )}
    </div>
  );
}
