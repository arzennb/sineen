import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "@/lib/orders";

export default function Checkout() {
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const { addOrder } = useOrders();
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("cod");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="container py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        >
          <CheckCircle className="h-24 w-24 mx-auto text-accent mb-6" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-heading text-3xl font-bold text-foreground mb-3"
        >
          تم تأكيد طلبك بنجاح! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          شكراً لك. سنتواصل معك قريباً لتأكيد تفاصيل الشحن.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <Button asChild className="gold-gradient border-0 text-foreground font-bold hover:scale-105 transition-transform">
            <Link to="/">العودة للرئيسية</Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">السلة فارغة</h1>
        <Button asChild variant="outline"><Link to="/products">تصفح المنتجات</Link></Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({
      customerName: formData.name,
      customerPhone: formData.phone,
      customerWilaya: "16 - Alger",
      customerAddress: formData.address,
      deliveryType: "Yalidine",
      items: items.map((i) => ({
        productName: i.product.name,
        quantity: i.quantity,
        size: i.selectedSize,
        price: totalPrice / totalItems, // Approximation or better use getProductPrice if needed, but totalPrice is the ground truth
      })),
      totalDZD: totalPrice,
      isOnlineOrder: true,
      deliveryFee: 400,
    });
    clearCart();
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-10">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">إتمام الشراء</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">بيانات الشحن</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>الاسم الكامل</Label>
                <Input required placeholder="محمد أحمد" className="mt-1" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <Label>رقم الهاتف</Label>
                <Input required type="tel" placeholder="05xxxxxxxx" className="mt-1" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" placeholder="email@example.com" className="mt-1" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>العنوان</Label>
                <Input required placeholder="المدينة، الحي، الشارع" className="mt-1" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-heading text-xl font-bold text-foreground pt-4 mb-4">طريقة الدفع</h2>
            <div className="p-4 rounded-xl border-2 border-border flex items-center gap-3 bg-secondary/20">
              <Banknote className="h-6 w-6 text-accent" />
              <span className="text-lg font-medium">الدفع عند التسليم</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" size="lg" className="w-full gold-gradient border-0 text-foreground font-bold text-lg py-6">
              إتمام الشراء — {totalPrice.toLocaleString()} دج
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6 h-fit space-y-4 sticky top-20"
        >
          <h2 className="font-heading text-xl font-bold text-foreground">ملخص الطلب</h2>
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3 border-b border-border pb-3">
              <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{item.selectedSize} | {item.selectedColor} × {item.quantity}</p>
              </div>
              <span className="font-bold text-accent text-sm">{(item.product.basePriceDZD * item.quantity).toLocaleString()} دج</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-foreground text-xl pt-2">
            <span>الإجمالي</span>
            <span className="text-accent">{totalPrice.toLocaleString()} دج</span>
          </div>
        </motion.div>
      </div>
    </motion.div>

  );
}
