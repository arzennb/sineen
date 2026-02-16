import { useState } from "react";
import { useOrders, OrderStatus } from "@/lib/orders";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, Truck, CheckCircle2, Phone, MapPin, Mail, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<OrderStatus, { color: string; icon: typeof Package; next?: OrderStatus }> = {
  "جديد": { color: "bg-blue-100 text-blue-700", icon: Clock, next: "قيد التجهيز" },
  "قيد التجهيز": { color: "bg-amber-100 text-amber-700", icon: Package, next: "تم الشحن" },
  "تم الشحن": { color: "bg-purple-100 text-purple-700", icon: Truck, next: "مكتمل" },
  "مكتمل": { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

const allStatuses: OrderStatus[] = ["جديد", "قيد التجهيز", "تم الشحن", "مكتمل"];

export default function Dashboard() {
  const { orders, updateStatus } = useOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "الكل">("الكل");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-lg"
        >
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 font-heading">تسجيل الدخول للوحة التحكم</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full gold-gradient border-0 text-foreground font-bold">
              دخول
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filtered = filterStatus === "الكل" ? orders : orders.filter((o) => o.status === filterStatus);

  const stats = [
    { label: "إجمالي الطلبات", value: orders.length, icon: ShoppingBag, color: "gold-gradient" },
    { label: "طلبات جديدة", value: orders.filter((o) => o.status === "جديد").length, icon: Clock, color: "bg-blue-500" },
    { label: "قيد التجهيز", value: orders.filter((o) => o.status === "قيد التجهيز").length, icon: Package, color: "bg-amber-500" },
    { label: "مكتملة", value: orders.filter((o) => o.status === "مكتمل").length, icon: CheckCircle2, color: "bg-green-500" },
  ];

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground mb-8">إدارة الطلبات ومتابعة حالتها</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`h-12 w-12 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["الكل", ...allStatuses] as const).map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterStatus === s
                ? "gold-gradient text-accent-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-accent/10"
            }`}
          >
            {s}
            {s !== "الكل" && (
              <span className="mr-1 text-xs">({orders.filter((o) => o.status === s).length})</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((order, i) => {
            const cfg = statusConfig[order.status];
            const StatusIcon = cfg.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-5 flex items-center gap-4 text-right"
                >
                  <div className={`h-10 w-10 rounded-lg ${cfg.color} flex items-center justify-center shrink-0`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">{order.id}</span>
                      <Badge className={`${cfg.color} border-0 text-xs`}>{order.status}</Badge>
                      {order.status === "جديد" && (
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="h-2 w-2 rounded-full bg-blue-500"
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customerName} — {order.date}</p>
                  </div>
                  <span className="font-bold text-accent text-lg">{order.total} ر.س</span>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                        {/* Customer info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{order.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{order.customerEmail || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{order.customerAddress}</span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="bg-secondary rounded-xl p-4">
                          <h4 className="font-bold text-foreground mb-3 text-sm">المنتجات</h4>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.productName}</p>
                                <p className="text-xs text-muted-foreground">{item.size} | {item.color} × {item.quantity}</p>
                              </div>
                              <span className="text-sm font-bold text-accent">{item.price * item.quantity} ر.س</span>
                            </div>
                          ))}
                        </div>

                        {/* Payment info */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            طريقة الدفع: {order.paymentMethod === "cod" ? "عند التسليم" : "بطاقة ائتمان"}
                          </span>

                          {/* Status update */}
                          {cfg.next && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                className="gold-gradient border-0 text-foreground font-bold"
                                onClick={() => updateStatus(order.id, cfg.next!)}
                              >
                                تحديث إلى: {cfg.next}
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-16">
            لا توجد طلبات بهذه الحالة
          </motion.p>
        )}
      </div>
    </div>
  );
}
