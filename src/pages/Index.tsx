import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Star, Truck, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { motion } from "framer-motion";

const features = [
  { icon: Star, title: "جودة فائقة", desc: "أقمشة مختارة بعناية من أجود الخامات" },
  { icon: Truck, title: "توصيل سريع", desc: "شحن مجاني لجميع أنحاء المملكة" },
  { icon: Shield, title: "دفع عند الاستلام", desc: "تسوق بثقة وادفع عند وصول طلبك" },
  { icon: Sparkles, title: "تصاميم حصرية", desc: "تشكيلات فريدة لا تجدها في مكان آخر" },
];

export default function Index() {
  const featured = products.filter((p) => p.featured);
  const [email, setEmail] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("الرجاء إدخال البريد الإلكتروني");
      return;
    }
    toast.success("تم الاشتراك بنجاح! شكراً لك 🎉");
    setEmail("");
  };

  const scrollToFeatured = () => {
    const element = document.getElementById('featured-products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[100svh] md:h-[90vh] min-h-[550px] flex items-end md:items-center overflow-hidden pb-12 md:pb-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-charcoal animate-pulse" />
        )}
        <motion.img
          src={heroBanner}
          alt="عباءات الصلاة"
          className="absolute inset-0 w-full h-full object-cover object-top md:object-center"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: imageLoaded ? 1 : 1.1, opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent md:bg-none md:hero-overlay" />

        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMEwyNSAxMEwyMCAyMEwxNSAxMFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+')]" />

        <div className="container relative z-10 text-primary-foreground">
          <motion.div
            className="max-w-2xl space-y-5 md:space-y-8 text-center md:text-right"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-block gold-gradient px-4 py-1.5 rounded-full text-xs md:text-sm font-medium text-accent-foreground"
            >
              ✨ تشكيلة جديدة 2026
            </motion.div>
            <h1 className="font-heading text-4xl md:text-7xl font-bold leading-snug md:leading-relaxed">
              أناقة الصلاة
              <br />
              <span className="text-gold">تبدأ من هنا</span>
            </h1>
            <p className="text-sm md:text-xl opacity-90 max-w-lg leading-relaxed mx-auto md:mx-0">
              اكتشف تشكيلتنا الفاخرة من العباءات الرجالية المصممة خصيصاً لراحتك وأناقتك أثناء الصلاة
            </p>
            <motion.div
              className="flex flex-col sm:flex-row items-center md:items-start gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button asChild size="lg" className="gold-gradient border-0 text-foreground font-bold text-base px-10 w-full sm:w-auto hover:scale-105 transition-transform">
                <Link to="/products">تسوق الآن</Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-charcoal text-primary-foreground border-0 hover:bg-foreground px-8 w-full sm:w-auto cursor-pointer font-bold"
                onClick={scrollToFeatured}
              >
                اكتشف التشكيلة
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/60" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4 group"
              >
                <div className="h-16 w-16 rounded-2xl gold-gradient flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <f.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="py-20">
        <div className="container">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-medium text-sm mb-2 block">الأكثر مبيعاً</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-3">المنتجات المميزة</h2>
            <p className="text-muted-foreground text-lg">أفضل اختياراتنا من العباءات الفاخرة</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-10 hover:scale-105 transition-transform"
            >
              <Link to="/products">عرض جميع المنتجات</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary">
        <motion.div
          className="container text-center text-primary-foreground"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">اشترك ليصلك كل جديد</h2>
          <p className="opacity-80 mb-8 max-w-md mx-auto">كن أول من يعرف عن العروض الحصرية والتشكيلات الجديدة</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent"
            />
            <Button type="submit" className="gold-gradient border-0 text-foreground font-bold px-8 hover:scale-105 transition-transform">
              اشتراك
            </Button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
