import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container py-20 text-center">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
        </motion.div>
        <h1 className="font-heading text-2xl font-bold mb-2">السلة فارغة</h1>
        <p className="text-muted-foreground mb-6">لم تضف أي منتجات بعد</p>
        <Button asChild className="gold-gradient border-0 text-foreground font-bold hover:scale-105 transition-transform">
          <Link to="/products">تصفح المنتجات</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-10">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">سلة التسوق</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="bg-card rounded-xl border border-border p-4 flex gap-4 hover:shadow-md transition-shadow"
              >
                <img src={item.product.image} alt={item.product.name} className="w-24 h-32 object-cover rounded-lg" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-heading font-bold text-foreground">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">المقاس: {item.selectedSize} | اللون: {item.selectedColor}</p>
                  <p className="font-bold text-accent text-lg">{item.product.price} ر.س</p>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </motion.button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeItem(item.product.id)}
                      className="mr-auto text-destructive hover:text-destructive/80 transition-colors p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6 h-fit space-y-4 sticky top-20"
        >
          <h3 className="font-heading text-xl font-bold text-foreground">ملخص الطلب</h3>
          <div className="flex justify-between text-muted-foreground">
            <span>المجموع الفرعي</span>
            <span>{totalPrice} ر.س</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>الشحن</span>
            <span className="text-accent font-medium">مجاني</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between font-bold text-foreground text-xl">
            <span>الإجمالي</span>
            <span className="text-accent">{totalPrice} ر.س</span>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild size="lg" className="w-full gold-gradient border-0 text-foreground font-bold text-base">
              <Link to="/checkout">إتمام الشراء</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
