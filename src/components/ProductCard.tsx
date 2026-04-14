import { Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Eye, X } from "lucide-react";
import { Product, useProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { getProductPrice } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [showSizes, setShowSizes] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizes(!showSizes);
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, size, product.colors[0]);
    toast({ title: "تمت الإضافة ✓", description: `${product.name} (مقاس ${size}) أُضيف إلى السلة` });
    setShowSizes(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-card rounded-xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-accent/30">
          <div className="aspect-[3/4] overflow-hidden relative">

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Size Selection Overlay */}
            {showSizes && (
              <div 
                className="absolute inset-0 bg-card/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(false); }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
                <h4 className="font-bold text-foreground mb-3 text-sm">اختر المقاس</h4>
                <div className="grid grid-cols-3 gap-2 w-full">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleSizeSelect(e, size)}
                      className="py-2 px-1 text-sm font-bold border border-border rounded-lg hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="bg-card/90 backdrop-blur-sm rounded-full p-3">
                  <Eye className="h-5 w-5 text-foreground" />
                </div>
              </motion.div>
            </div>
            {/* Sale badge */}
            {product.discountPercent > 0 && (
              <div className="absolute top-4 left-4 gold-gradient text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-full">
                خصم {product.discountPercent}%
              </div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-heading text-lg font-bold text-foreground leading-tight group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.fabricType}</p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-accent">{price.toLocaleString()} دج</span>
                {product.discountPercent > 0 && (
                  <span className="text-lg text-muted-foreground line-through">{originalPrice.toLocaleString()} دج</span>
                )}
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110"
                onClick={handleAddClick}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
