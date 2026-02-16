import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Tag, Percent } from "lucide-react";
import { motion } from "framer-motion";

export default function Offers() {
  const offers = products.filter((p) => p.originalPrice);

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gold-gradient rounded-2xl p-10 text-center mb-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMEwyNSAxMEwyMCAyMEwxNSAxMFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+')]" />
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="inline-block"
        >
          <Tag className="h-12 w-12 mx-auto mb-4 text-accent-foreground" />
        </motion.div>
        <h1 className="font-heading text-3xl md:text-5xl font-bold text-accent-foreground mb-2 relative">العروض الخاصة</h1>
        <p className="text-accent-foreground/80 text-lg relative">خصومات حصرية على أفضل العباءات</p>
      </motion.div>

      {offers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-16">لا توجد عروض حالياً</p>
      )}
    </div>
  );
}
