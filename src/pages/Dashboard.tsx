import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useOrders, OrderStatus, algerianWilayas, Order } from "@/lib/orders";
import { useProducts, Product } from "@/lib/products";
import { 
  Package, ShoppingBag, Plus, Save, Edit, Trash2, Settings,
  Search, DollarSign, Store, Printer, Wifi, X, Shield, Minus, ShoppingCart, 
  Activity, Clock, AlertTriangle, Layers, Phone, User, ImagePlus
} from "lucide-react";
import { Button, Badge, Input, Card } from "@/components/SimpleUI";
import AdminNavbar from "@/components/AdminNavbar";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

/**
 * Saneen Dynamic Admin Dashboard
 * Clean, Professional, Arabic Optimized
 */

export default function Dashboard() {
  const { hash } = useLocation();
  const ordersContext = useOrders();
  const productsContext = useProducts();

  const orders = ordersContext?.orders || [];
  const wilayaFees = ordersContext?.wilayaFees || {};
  const addOrder = ordersContext?.addOrder || (() => {});
  const updateStatus = ordersContext?.updateStatus || (() => {});
  const updateOrder = ordersContext?.updateOrder || (() => {});
  const deleteOrder = ordersContext?.deleteOrder || (() => {});
  const updateWilayaFee = ordersContext?.updateWilayaFee || (() => {});
  
  const { 
    products, sizes, cuts, fabrics, categories, 
    addProduct, updateProduct, deleteProduct, sellInStore, getProductPrice, updateFilter 
  } = productsContext!;

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const tab = hash ? hash.replace("#", "") : "overview";
    setActiveTab(tab || "overview");
  }, [hash]);

  // POS State
  const [posSearch, setPosSearch] = useState("");
  const filteredPosProducts = products.filter(p => 
    p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.id.includes(posSearch)
  );
  const revenueOnline = ordersContext?.getTotalRevenue('online') || 0;
  const revenueStore = ordersContext?.getTotalRevenue('store') || 0;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [editOrderData, setEditOrderData] = useState<Partial<Order>>({ items: [] });
  const [editProductSearch, setEditProductSearch] = useState("");

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "", basePriceDZD: 0, discountPercent: 0, stock: {}, isPublished: true, reorderLevel: 2, image: ""
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.basePriceDZD) {
        toast.error("يرجى إكمال البيانات المطلوبة");
        return;
    }
    // Auto-populate sizes from current dynamic list and set fabric = fabricType
    const finalData = {
      ...formData,
      sizes: sizes,
      fabric: formData.fabricType || "",
      colors: formData.colors?.length ? formData.colors : ["أسود"],
    };
    if (isEditing) {
      updateProduct(isEditing, finalData);
      toast.success("تم تحديث المنتج بنجاح");
    } else {
      addProduct(finalData as Omit<Product, "id">);
      toast.success("تمت إضافة المنتج بنجاح");
    }
    setIsModalOpen(false);
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit to 2MB to prevent localStorage bloat
      if (file.size > 2 * 1024 * 1024) {
        toast.error("الصورة كبيرة جداً (الحد الأقصى 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderToEdit) return;
    updateOrder(orderToEdit.id, editOrderData);
    toast.success("تم تحديث الطلب بنجاح");
    setIsEditOrderModalOpen(false);
  };

  const openAddModal = () => {
    setIsEditing(null);
    setFormData({
      name: "", basePriceDZD: 0, sizePrices: {}, discountPercent: 0, stock: {}, image: "", 
      sizes: sizes, colors: ["أسود"], reorderLevel: 5, isPublished: true, featured: false,
      category: categories[0], cut: cuts[0], fabricType: fabrics[0]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
      setFormData(p);
      setIsEditing(p.id);
      setIsModalOpen(true);
  };

  const openEditOrderModal = (o: Order) => {
    setOrderToEdit(o);
    setEditOrderData({ ...o, items: [...o.items] });
    setIsEditOrderModalOpen(true);
  };

  const addItemToEditOrder = (product: Product, size: string) => {
    if (!editOrderData.items) return;
    const price = getProductPrice(product, size);
    const newItems = [...editOrderData.items, { productName: product.name, quantity: 1, size, price }];
    const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setEditOrderData({ ...editOrderData, items: newItems, totalDZD: newTotal });
  };

  const removeItemFromEditOrder = (index: number) => {
    if (!editOrderData.items) return;
    const newItems = editOrderData.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setEditOrderData({ ...editOrderData, items: newItems, totalDZD: newTotal });
  };

  const [wilayaSearch, setWilayaSearch] = useState("");
  const filteredWilayas = algerianWilayas.filter(w => w.toLowerCase().includes(wilayaSearch.toLowerCase()));
  
  const [orderSearch, setOrderSearch] = useState("");
  const [orderTabFilter, setOrderTabFilter] = useState<"all" | "online" | "store">("all");
  
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
      (o.customerPhone && o.customerPhone.includes(orderSearch)) || 
      (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase()));
    if (orderTabFilter === "online") return matchesSearch && o.isOnlineOrder;
    if (orderTabFilter === "store") return matchesSearch && !o.isOnlineOrder;
    return matchesSearch;
  });
  const [newFilterValues, setNewFilterValues] = useState({ sizes: "", cuts: "", fabrics: "", categories: "" });

  const handleAddFilter = (type: 'sizes' | 'cuts' | 'fabrics' | 'categories') => {
    const val = newFilterValues[type];
    if (!val) return;
    updateFilter(type, 'add', val);
    setNewFilterValues({ ...newFilterValues, [type]: "" });
    toast.success("تمت إضافة الفلتر");
  };

  const [posCart, setPosCart] = useState<{product: Product, size: string, quantity: number, price: number}[]>([]);
  const [flippedProductId, setFlippedProductId] = useState<string | null>(null);

  const addToPosCart = (product: Product, size: string) => {
    const price = getProductPrice(product, size);
    setPosCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => item === existing ? {...item, quantity: item.quantity + 1} : item);
      }
      return [...prev, { product, size, quantity: 1, price }];
    });
  };

  const removeFromPosCart = (index: number) => {
    setPosCart(prev => prev.filter((_, i) => i !== index));
  };

  const updatePosCartQty = (index: number, delta: number) => {
    setPosCart(prev => prev.map((item, i) => {
      if (i === index) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  const processPosSale = async () => {
    if (posCart.length === 0) return;
    const subtotal = posCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    addOrder({
       customerName: "زبون محلي",
       customerPhone: "0000000000",
       customerWilaya: "بيع مباشر",
       deliveryType: "محل",
       items: posCart.map(i => ({ productName: i.product.name, quantity: i.quantity, price: i.price, size: i.size })),
       totalDZD: subtotal,
       isOnlineOrder: false,
       deliveryFee: 0,
       status: "مكتمل"
    });
    for (const item of posCart) {
       for (let n = 0; n < item.quantity; n++) sellInStore(item.product.id, item.size);
    }
    document.body.classList.add('printing-receipt');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-receipt');
      setPosCart([]);
    }, 300);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem("admin_auth") === "true"; } catch(e) { return false; }
  });
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center p-6 text-right">
        <div className="max-w-md w-full p-12 bg-white rounded-2xl shadow-xl flex flex-col items-center border border-slate-100">
          <Shield className="h-16 w-16 text-black mb-8" />
          <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase">تسجيل الدخول</h2>
          <Input type="password" placeholder="كلمة المرور" id="login-pwd" className="saneen-input w-full text-center text-lg mb-4" />
          <button onClick={() => { 
              const p = (document.getElementById('login-pwd') as HTMLInputElement).value;
              if(p === "admin123" || p === "سنين") { setIsAuthenticated(true); sessionStorage.setItem("admin_auth", "true"); }
              else toast.error("خطأ في كلمة المرور");
          }} className="saneen-btn-dark w-full h-14">دخول النظام</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <AdminNavbar />

      <div className="container max-w-7xl mx-auto px-6 pt-32 no-print">
        
        {activeTab === "overview" && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-4">
               <div>
                  <h1 className="text-3xl font-semibold text-[#1A1A1A]">أهلاً بك</h1>
                  <p className="text-[#8E8B83] text-sm mt-1">نظرة سريعة على أداء متجر سنين</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => window.location.hash = "#pos"} className="saneen-btn-dark">
                     <ShoppingCart className="h-4 w-4" />
                     <span>بيع سريع</span>
                  </button>
                  <button onClick={() => window.location.hash = "#catalog"} className="saneen-btn-outline">
                     <Plus className="h-4 w-4" />
                     <span>إضافة منتج</span>
                  </button>
               </div>
            </div>

            {/* Subtle KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "مبيعات الموقع", val: revenueOnline, icon: Wifi },
                { title: "مبيعات المحل", val: revenueStore, icon: Store },
                { title: "إجمالي المداخيل", val: revenueOnline + revenueStore, icon: DollarSign },
              ].map((card, i) => (
                <div key={i} className="saneen-card p-10 border-[#F5F2ED]">
                   <div className="flex justify-between items-center mb-6">
                      <div className="h-12 w-12 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#A68966]">
                         <card.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#8E8B83] tracking-widest">اليوم</span>
                   </div>
                   <p className="text-[11px] font-semibold text-[#8E8B83] uppercase tracking-widest mb-1">{card.title}</p>
                   <div className="flex items-baseline gap-2">
                     <h3 className="text-3xl font-bold text-[#1A1A1A]">{card.val.toLocaleString()}</h3>
                     <span className="text-xs text-[#BCB9B3]">دج</span>
                   </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Activities */}
               <div className="lg:col-span-8">
                  <div className="saneen-card p-8 min-h-[500px]">
                     <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F7F5F0]">
                        <h2 className="text-xl font-semibold text-[#1A1A1A]">العمليات الأخيرة</h2>
                        <button onClick={() => window.location.hash = "#orders"} className="text-xs font-semibold text-[#A68966] opacity-60 hover:opacity-100 transition-opacity">مشاهدة الكل</button>
                     </div>
                     <div className="space-y-4">
                        {orders.slice(0, 5).map(o => (
                           <div key={o.id} className="flex items-center justify-between p-5 rounded-2xl hover:bg-[#FDFCFB] border border-transparent hover:border-[#F2EFE9] transition-all">
                              <div className="flex items-center gap-5">
                                 <div className={`h-12 w-12 rounded-full flex items-center justify-center ${o.isOnlineOrder ? 'text-indigo-400 bg-indigo-50/30' : 'text-[#A68966] bg-[#F7F5F0]'}`}>
                                    {o.isOnlineOrder ? <Wifi className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                                 </div>
                                 <div>
                                    <p className="text-sm font-semibold text-[#1A1A1A]">{(o.customerName === "زبون محلي" || o.customerName.includes("عميل محلي")) ? "بيع مباشر (المحل)" : o.customerName}</p>
                                    <p className="text-[10px] text-[#BCB9B3]">#{o.id} • {o.date}</p>
                                 </div>
                              </div>
                              <span className="font-bold text-lg">{o.totalDZD.toLocaleString()} <span className="text-[10px] opacity-30">دج</span></span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Stock & Distribution */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="saneen-card p-8 bg-[#2D2B29] text-white">
                     <h2 className="text-sm font-semibold mb-6 flex items-center gap-3 text-[#A68966] uppercase tracking-widest"><AlertTriangle className="h-4 w-4" /> تنبيهات المخزون</h2>
                     <div className="space-y-4">
                        {products.filter(p => Object.values(p.stock || {}).reduce((a,b)=>a+b,0) <= (p.reorderLevel || 5)).slice(0, 3).map(p => (
                           <div key={p.id} className="p-4 bg-white/5 rounded-xl flex justify-between items-center">
                              <span className="text-xs font-medium text-[#DED9D2]">{p.name}</span>
                              <span className="text-[10px] font-bold text-red-500">{Object.values(p.stock).reduce((a,b)=>a+b,0)} قطعة</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <Card className="saneen-card p-8">
                     <h2 className="text-sm font-semibold mb-8 text-[#1A1A1A] uppercase tracking-widest">توزيع القنوات</h2>
                     <div className="space-y-6">
                        {[
                           { label: "الموقع", pct: Math.round((revenueOnline / (revenueOnline + revenueStore || 1)) * 100), color: "#A68966" },
                           { label: "المحل", pct: Math.round((revenueStore / (revenueOnline + revenueStore || 1)) * 100), color: "#DED9D2" }
                        ].map((s, i) => (
                           <div key={i} className="space-y-3">
                              <div className="flex justify-between text-[10px] font-bold text-[#8E8B83] uppercase tracking-widest">
                                 <span>{s.label}</span>
                                 <span>{s.pct}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#F7F5F0] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#A68966]" style={{ width: `${s.pct}%`, backgroundColor: i === 1 ? '#DED9D2' : '#A68966' }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </Card>
               </div>
            </div>
          </div>
        )}

        {/* POS */}
        {activeTab === "pos" && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
              <div className="lg:col-span-8 space-y-6">
                 <div className="saneen-card p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <h1 className="text-2xl font-black text-gray-900">محطة البيع</h1>
                    <Input placeholder="بحث عن منتج..." value={posSearch} onChange={e => setPosSearch(e.target.value)} className="saneen-input w-full md:w-80" />
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto max-h-[70vh]">
                    {filteredPosProducts.map(p => (
                      <div key={p.id} className="saneen-card group cursor-pointer" onClick={() => setFlippedProductId(flippedProductId === p.id ? null : p.id)}>
                         <div className="aspect-[4/5] relative bg-slate-50 overflow-hidden">
                             {flippedProductId === p.id ? (
                                <div className="absolute inset-0 bg-black p-6 flex flex-col justify-center gap-2">
                                   {Object.entries(p.stock).filter(([_, q]) => q > 0).map(([s, q]) => (
                                      <button key={s} onClick={(e) => { e.stopPropagation(); addToPosCart(p, s); setFlippedProductId(null); }} className="h-10 bg-white/10 text-white text-[10px] font-bold hover:bg-[#C5A059] rounded-lg">مقاس {s} ({q})</button>
                                   ))}
                                </div>
                             ) : (
                                <img src={p.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                             )}
                         </div>
                         <div className="p-4 flex justify-between items-center">
                            <h4 className="font-bold text-xs truncate max-w-[100px]">{p.name}</h4>
                            <span className="text-xs font-black">{p.basePriceDZD.toLocaleString()} دج</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="lg:col-span-4">
                 <div className="saneen-card h-[calc(100vh-160px)] flex flex-col sticky top-32">
                    <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                        <h3 className="text-lg font-black">سلة المشتريات</h3>
                        <Button variant="outline" size="sm" onClick={() => setPosCart([])} className="h-8 text-xs">إفراغ</Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                       {posCart.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-50 shadow-sm">
                             <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold truncate">{item.product.name} ({item.size})</h4>
                                <div className="flex items-center gap-4 mt-2">
                                   <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                      <button onClick={() => updatePosCartQty(idx, -1)} className="h-6 w-6 flex items-center justify-center bg-white rounded shadow-sm text-xs">-</button>
                                      <span className="text-xs font-bold">{item.quantity}</span>
                                      <button onClick={() => updatePosCartQty(idx, 1)} className="h-6 w-6 flex items-center justify-center bg-white rounded shadow-sm text-xs">+</button>
                                   </div>
                                   <span className="text-xs font-black">{(item.price * item.quantity).toLocaleString()} دج</span>
                                </div>
                             </div>
                             <button onClick={() => removeFromPosCart(idx)} className="text-red-200 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                          </div>
                       ))}
                    </div>
                    <div className="p-8 bg-black text-white rounded-t-3xl">
                        <div className="flex justify-between items-center text-xl font-black mb-8">
                           <span>المجموع</span>
                           <span>{posCart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()} دج</span>
                        </div>
                        <button onClick={processPosSale} disabled={posCart.length === 0} className="saneen-btn-gold w-full h-16 text-lg"><Printer className="h-6 w-6" /> تأكيد وطباعة</button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* CATALOG */}
        {activeTab === "catalog" && (
           <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center saneen-card p-10">
                 <h1 className="text-2xl font-black text-gray-900">إدارة المنتجات</h1>
                 <button onClick={openAddModal} className="saneen-btn-gold h-14">إضافة قطعة جديدة <Plus className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                 {products.map(p => (
                   <div key={p.id} className="saneen-card group overflow-hidden border-slate-100/50 hover:shadow-xl hover:border-[#A68966]/20 transition-all">
                      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                         {p.image && <img src={p.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-[2px]">
                             <button onClick={() => openEditModal(p)} className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-all shadow-xl"><Edit className="h-6 w-6"/></button>
                             <button onClick={() => {if(confirm('هل تريد حذف هذا المنتج نهائياً؟')) deleteProduct(p.id);}} className="h-14 w-14 bg-white text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 className="h-6 w-6"/></button>
                         </div>
                         <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <Badge className="bg-white/90 backdrop-blur text-black border-0 font-bold px-3 py-1.5 rounded-lg shadow-sm">{p.category}</Badge>
                            {p.discountPercent > 0 && <Badge className="bg-red-500 text-white border-0 font-bold px-3 py-1.5 rounded-lg shadow-sm">-{p.discountPercent}%</Badge>}
                         </div>
                      </div>
                      <div className="p-8 space-y-6">
                         <div className="flex justify-between items-start gap-4">
                            <h4 className="text-lg font-black leading-tight text-gray-900 group-hover:text-[#A68966] transition-colors">{p.name}</h4>
                            <div className="text-right">
                               <div className="text-sm font-black text-gray-900">{getProductPrice(p, p.sizes[0]).toLocaleString()} دج</div>
                               {p.discountPercent > 0 && <div className="text-[10px] text-slate-400 line-through font-bold">{(p.basePriceDZD).toLocaleString()} دج</div>}
                            </div>
                         </div>
                         <div className="flex justify-between items-center py-4 px-5 bg-[#F8F7F4] rounded-2xl border border-[#E5E0D8]/30">
                            <div className="flex items-center gap-2">
                               <div className={`h-2 w-2 rounded-full ${Object.values(p.stock).reduce((a,b)=>a+b,0) > 5 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                               <span className="text-[10px] font-black text-[#8E8B83] uppercase tracking-wider">المخزون</span>
                            </div>
                            <span className="text-sm font-black text-gray-900">{Object.values(p.stock).reduce((a,b)=>a+b,0)} قطعة</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-10 animate-in fade-in duration-500 text-right">
             <div className="flex flex-col lg:flex-row justify-between items-center gap-8 saneen-card p-10">
                <div className="space-y-4">
                    <h1 className="text-2xl font-black">سجل المبيعات</h1>
                    <div className="flex items-center gap-2">
                        {[{ id: 'all', label: 'الكل' }, { id: 'online', label: 'الموقع' }, { id: 'store', label: 'المحل' }].map(tab => (
                          <button key={tab.id} onClick={() => setOrderTabFilter(tab.id as any)} className={`px-6 py-2 rounded-xl text-[12px] font-bold ${orderTabFilter === tab.id ? 'bg-black text-white' : 'hover:bg-slate-50'}`}>{tab.label}</button>
                        ))}
                    </div>
                </div>
                <Input placeholder="بحث برقم الطلب..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className="saneen-input w-full lg:w-80" />
             </div>
            <div className="saneen-card overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[800px]">
                   <thead className="bg-slate-50 text-slate-400 text-[11px] font-bold">
                     <tr>
                       <th className="py-8 px-10">رقم الطلب</th>
                       <th className="py-8 px-10">الزبون</th>
                       <th className="py-8 px-10 text-center">المصدر</th>
                       <th className="py-8 px-10 text-center">المبلغ</th>
                       <th className="py-8 px-10 text-center">الحالة</th>
                       <th className="py-8 px-10 text-center">إجراءات</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-all font-bold">
                          <td className="py-8 px-10 font-sans">#{o.id}</td>
                          <td className="py-8 px-10">{(o.customerName === "زبون محلي" || o.customerName.includes("عميل محلي")) ? "بيع مباشر (المحل)" : o.customerName}</td>
                          <td className="py-8 px-10 text-center">{o.isOnlineOrder ? <Badge className="bg-blue-50 text-blue-600">الموقع</Badge> : <Badge className="bg-orange-50 text-orange-600">المحل</Badge>}</td>
                          <td className="py-8 px-10 text-center font-sans tracking-tight">{o.totalDZD.toLocaleString()} دج</td>
                          <td className="py-8 px-10 text-center">
                              {o.isOnlineOrder ? (
                                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)} className="border rounded-xl px-4 py-2 outline-none cursor-pointer text-[11px] font-black">
                                  {["قيد التحضير", "تم التسليم", "ملغى"].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              ) : (
                                <Badge className="bg-green-50 text-green-600 font-black">مكتمل</Badge>
                              )}
                          </td>
                          <td className="py-8 px-10 text-center">
                             <div className="flex items-center justify-center gap-3">
                                <button className="h-10 w-10 border rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all" onClick={() => {setSelectedOrder(o); setIsInvoiceOpen(true);}}><Printer className="h-4 w-4" /></button>
                                <button className="h-10 w-10 border rounded-xl flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-all" onClick={() => openEditOrderModal(o)}><Edit className="h-4 w-4" /></button>
                                <button className="h-10 w-10 border rounded-xl flex items-center justify-center text-red-200 hover:bg-red-600 hover:text-white transition-all" onClick={() => {if(confirm('متأكد؟')) deleteOrder(o.id);}}><Trash2 className="h-4 w-4" /></button>
                             </div>
                          </td>
                        </tr>
                     ))}
                   </tbody>
                </table>
            </div>
          </div>
        )}
        {/* FILTERS */}
        {activeTab === "filters" && (
          <div className="space-y-10 animate-in fade-in duration-500 text-right">
             <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black">إدارة فلاتر المنتجات</h1>
                <p className="text-xs text-slate-400 font-bold">التحكم في خيارات المقاسات، الأقمشة، والقصات</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sizes Management */}
                <Card className="saneen-card p-10 space-y-8">
                   <h3 className="font-black text-lg border-b pb-4">المقاسات المتاحة</h3>
                   <div className="flex flex-wrap gap-2">
                      {sizes.map(s => (
                        <Badge key={s} className="bg-slate-100 text-black border-0 py-2 px-4 flex items-center gap-2 rounded-xl group transition-all hover:bg-red-50 hover:text-red-500">
                           {s}
                           <button onClick={() => updateFilter('sizes', 'remove', s)}><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                   </div>
                   <div className="flex gap-2">
                      <Input placeholder="إضافة مقاس جديد..." value={newFilterValues.sizes} onChange={e => setNewFilterValues({...newFilterValues, sizes: e.target.value})} className="saneen-input h-12" />
                      <button onClick={() => handleAddFilter('sizes')} className="bg-black text-white px-6 rounded-xl hover:bg-gold transition-all"><Plus className="h-4 w-4" /></button>
                   </div>
                </Card>

                {/* Fabrics Management */}
                <Card className="saneen-card p-10 space-y-8">
                   <h3 className="font-black text-lg border-b pb-4">أنواع الأقمشة</h3>
                   <div className="flex flex-wrap gap-2">
                      {fabrics.map(f => (
                        <Badge key={f} className="bg-slate-100 text-black border-0 py-2 px-4 flex items-center gap-2 rounded-xl group transition-all hover:bg-red-50 hover:text-red-500">
                           {f}
                           <button onClick={() => updateFilter('fabrics', 'remove', f)}><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                   </div>
                   <div className="flex gap-2">
                      <Input placeholder="إضافة نوع قماش..." value={newFilterValues.fabrics} onChange={e => setNewFilterValues({...newFilterValues, fabrics: e.target.value})} className="saneen-input h-12" />
                      <button onClick={() => handleAddFilter('fabrics')} className="bg-black text-white px-6 rounded-xl hover:bg-gold transition-all"><Plus className="h-4 w-4" /></button>
                   </div>
                </Card>

                {/* Cuts Management */}
                <Card className="saneen-card p-10 space-y-8">
                   <h3 className="font-black text-lg border-b pb-4">أنواع القصات</h3>
                   <div className="flex flex-wrap gap-2">
                      {cuts.map(c => (
                        <Badge key={c} className="bg-slate-100 text-black border-0 py-2 px-4 flex items-center gap-2 rounded-xl group transition-all hover:bg-red-50 hover:text-red-500">
                           {c}
                           <button onClick={() => updateFilter('cuts', 'remove', c)}><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                   </div>
                   <div className="flex gap-2">
                      <Input placeholder="إضافة قصة جديدة..." value={newFilterValues.cuts} onChange={e => setNewFilterValues({...newFilterValues, cuts: e.target.value})} className="saneen-input h-12" />
                      <button onClick={() => handleAddFilter('cuts')} className="bg-black text-white px-6 rounded-xl hover:bg-gold transition-all"><Plus className="h-4 w-4" /></button>
                   </div>
                </Card>

                {/* Categories Management */}
                <Card className="saneen-card p-10 space-y-8">
                   <h3 className="font-black text-lg border-b pb-4">الأقسام (Categories)</h3>
                   <div className="flex flex-wrap gap-2">
                      {categories.map(c => (
                        <Badge key={c} className="bg-gold/10 text-gold border-0 py-2 px-4 flex items-center gap-2 rounded-xl group transition-all hover:bg-red-50 hover:text-red-500">
                           {c}
                           <button onClick={() => updateFilter('categories', 'remove', c)}><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                   </div>
                   <div className="flex gap-2">
                      <Input placeholder="إضافة فئة جديدة..." value={newFilterValues.categories} onChange={e => setNewFilterValues({...newFilterValues, categories: e.target.value})} className="saneen-input h-12" />
                      <button onClick={() => handleAddFilter('categories')} className="bg-black text-white px-6 rounded-xl hover:bg-gold transition-all"><Plus className="h-4 w-4" /></button>
                   </div>
                </Card>
             </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-10 animate-in fade-in duration-500 text-right">
             <h1 className="text-2xl font-black">إعدادات النظام</h1>
             <Card className="saneen-card p-12">
                <h2 className="text-2xl font-black mb-10 border-b pb-6">أسعار التوصيل ولائية</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {algerianWilayas.map((wilaya) => (
                        <div key={wilaya} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl">
                            <label className="text-xs font-bold text-slate-500">{wilaya}</label>
                            <input type="number" value={wilayaFees[wilaya] || 0} onChange={(e) => updateWilayaFee(wilaya, Number(e.target.value))} className="h-10 bg-white border rounded-lg px-4 font-black text-xs text-left" dir="ltr" />
                        </div>
                    ))}
                </div>
             </Card>
          </div>
        )}
      </div>

      {/* MODALS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[500] flex items-center justify-center p-4">
           <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl relative text-right overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-l from-[#2D2B29] to-[#1A1A1A] px-10 py-8 flex justify-between items-center">
                 <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white transition-colors"><X className="h-6 w-6"/></button>
                 <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <Package className="h-5 w-5 text-[#C5A059]" />
                    {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                 </h2>
              </div>

              {/* Body */}
              <div className="p-10 overflow-y-auto max-h-[calc(90vh-180px)] space-y-8">
                 <form onSubmit={handleSaveProduct} className="space-y-8" id="product-form">

                    {/* Row 1: Name + Base Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="saneen-label">اسم المنتج *</label>
                           <input 
                             required
                             value={formData.name || ""} 
                             onChange={e => setFormData({...formData, name: e.target.value})} 
                             className="saneen-input w-full" 
                             placeholder="مثال: عباءة كلاسيكية فاخرة"
                           />
                        </div>
                        <div className="space-y-4">
                           <div>
                              <label className="saneen-label">السعر الأساسي (دج) *</label>
                              <input 
                                required 
                                type="number" 
                                value={formData.basePriceDZD || ""} 
                                onChange={e => setFormData({...formData, basePriceDZD: Number(e.target.value)})} 
                                className="saneen-input w-full" 
                                placeholder="8500"
                              />
                           </div>
                           {(formData.basePriceDZD || 0) > 0 && (
                              <div className="bg-[#A68966]/5 p-3 rounded-xl border border-[#A68966]/10 flex justify-between items-center animate-in slide-in-from-top-2 duration-300">
                                 <span className="text-[10px] font-black text-[#A68966]">السعر بعد الخصم:</span>
                                 <span className="text-sm font-black text-[#1A1A1A]">
                                    {Math.round((formData.basePriceDZD || 0) * (1 - (formData.discountPercent || 0) / 100)).toLocaleString()} دج
                                 </span>
                              </div>
                           )}
                        </div>
                    </div>

                    {/* Row 2: Image + Discount */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                           <label className="saneen-label">صورة المنتج</label>
                           <div className="flex gap-4 items-center">
                              <div className="flex-1 relative group cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                                 <div className="saneen-input w-full flex items-center gap-4 text-[#8E8B83] overflow-hidden">
                                    <ImagePlus className="h-5 w-5 shrink-0" />
                                    <span className="truncate text-sm">{formData.image ? 'تم اختيار صورة (اضغط للتغيير)' : 'اضغط لرفع صورة من الجهاز...'}</span>
                                 </div>
                                 <input 
                                    id="image-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    className="hidden" 
                                 />
                              </div>
                              {formData.image && (
                                 <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border border-[#E5E0D8] group">
                                    <img src={formData.image} className="h-full w-full object-cover" />
                                    <button 
                                       type="button"
                                       onClick={() => setFormData({...formData, image: ""})}
                                       className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                       <X className="h-4 w-4" />
                                    </button>
                                 </div>
                              )}
                           </div>
                        </div>
                        <div>
                           <label className="saneen-label">نسبة الخصم %</label>
                           <input 
                             type="number" 
                             min="0" max="100"
                             value={formData.discountPercent || 0} 
                             onChange={e => setFormData({...formData, discountPercent: Number(e.target.value)})} 
                             className="saneen-input w-full" 
                             placeholder="0"
                           />
                        </div>
                    </div>

                    {/* Row 3: Fabric + Cut + Category */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                           <label className="saneen-label">نوع القماش</label>
                           <div className="flex gap-2">
                             <select 
                               className="saneen-select flex-1 appearance-none" 
                               value={formData.fabricType || ""} 
                               onChange={e => setFormData({...formData, fabricType: e.target.value})}
                             >
                               <option value="">اختر...</option>
                               {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
                             </select>
                             <button type="button" onClick={() => {
                               const val = prompt('أدخل نوع القماش الجديد:');
                               if(val && val.trim()) { updateFilter('fabrics', 'add', val.trim()); setFormData({...formData, fabricType: val.trim()}); }
                             }} className="h-14 w-14 shrink-0 bg-[#F8F7F4] border border-[#E5E0D8] rounded-2xl flex items-center justify-center text-[#A68966] hover:bg-[#A68966] hover:text-white hover:border-[#A68966] transition-all"><Plus className="h-4 w-4" /></button>
                           </div>
                        </div>
                        <div>
                           <label className="saneen-label">نوع القصة</label>
                           <div className="flex gap-2">
                             <select 
                               className="saneen-select flex-1 appearance-none" 
                               value={formData.cut || ""} 
                               onChange={e => setFormData({...formData, cut: e.target.value})}
                             >
                               <option value="">اختر...</option>
                               {cuts.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                             <button type="button" onClick={() => {
                               const val = prompt('أدخل نوع القصة الجديد:');
                               if(val && val.trim()) { updateFilter('cuts', 'add', val.trim()); setFormData({...formData, cut: val.trim()}); }
                             }} className="h-14 w-14 shrink-0 bg-[#F8F7F4] border border-[#E5E0D8] rounded-2xl flex items-center justify-center text-[#A68966] hover:bg-[#A68966] hover:text-white hover:border-[#A68966] transition-all"><Plus className="h-4 w-4" /></button>
                           </div>
                        </div>
                        <div>
                           <label className="saneen-label">الفئة</label>
                           <div className="flex gap-2">
                             <select 
                               className="saneen-select flex-1 appearance-none" 
                               value={formData.category || ""} 
                               onChange={e => setFormData({...formData, category: e.target.value})}
                             >
                               <option value="">اختر...</option>
                               {categories.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                             <button type="button" onClick={() => {
                               const val = prompt('أدخل اسم الفئة الجديدة:');
                               if(val && val.trim()) { updateFilter('categories', 'add', val.trim()); setFormData({...formData, category: val.trim()}); }
                             }} className="h-14 w-14 shrink-0 bg-[#F8F7F4] border border-[#E5E0D8] rounded-2xl flex items-center justify-center text-[#A68966] hover:bg-[#A68966] hover:text-white hover:border-[#A68966] transition-all"><Plus className="h-4 w-4" /></button>
                           </div>
                        </div>
                    </div>

                    {/* Row 4: Description */}
                    <div>
                       <label className="saneen-label">وصف المنتج</label>
                       <textarea 
                        className="saneen-input w-full !h-auto min-h-[100px] py-4 resize-none" 
                        value={formData.description || ""} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="اكتب وصفاً مختصراً يظهر للزبون..."
                       />
                    </div>

                    {/* Row 5: Stock Management */}
                    <div className="bg-[#FAFAF8] border border-[#E5E0D8] p-6 rounded-2xl space-y-4">
                      <label className="saneen-label">إدارة المخزون — الكمية لكل مقاس</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {sizes.map(s => (
                          <div key={s} className="text-center space-y-2">
                            <span className="text-[11px] font-black text-[#A68966] bg-[#A68966]/10 rounded-lg px-3 py-1 inline-block">{s}</span>
                            <input 
                              type="number" 
                              min="0" 
                              value={formData.stock?.[s] || 0} 
                              onChange={e => setFormData({...formData, stock: {...(formData.stock||{}), [s]: Number(e.target.value)}})} 
                              className="w-full h-12 border border-[#E5E0D8] bg-white rounded-xl text-center font-black text-sm text-gray-900 focus:border-[#A68966] focus:ring-2 focus:ring-[#A68966]/20 outline-none transition-all" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 6: OPTIONAL Per-Size Pricing */}
                    <div className="bg-[#FAFAF8] border border-[#E5E0D8] p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <button 
                          type="button"
                          onClick={() => {
                            if (formData.sizePrices && Object.keys(formData.sizePrices).length > 0) {
                              setFormData({...formData, sizePrices: {}});
                            } else {
                              const prices: Record<string, number> = {};
                              sizes.forEach(s => { prices[s] = formData.basePriceDZD || 0; });
                              setFormData({...formData, sizePrices: prices});
                            }
                          }}
                          className={`text-[11px] font-black px-4 py-2 rounded-xl transition-all ${
                            formData.sizePrices && Object.keys(formData.sizePrices).length > 0
                              ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                              : 'bg-[#A68966]/10 text-[#A68966] hover:bg-[#A68966]/20'
                          }`}
                        >
                          {formData.sizePrices && Object.keys(formData.sizePrices).length > 0 ? '✕ إلغاء التسعير المخصص' : '+ تفعيل تسعير مختلف لكل مقاس'}
                        </button>
                        <label className="saneen-label !mb-0">سعر مخصص لكل مقاس (اختياري)</label>
                      </div>
                      
                      {formData.sizePrices && Object.keys(formData.sizePrices).length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                          {sizes.map(s => (
                            <div key={s} className="text-center space-y-2">
                              <span className="text-[11px] font-black text-gray-500 bg-gray-100 rounded-lg px-3 py-1 inline-block">{s}</span>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  min="0" 
                                  value={formData.sizePrices?.[s] || formData.basePriceDZD || 0} 
                                  onChange={e => setFormData({...formData, sizePrices: {...(formData.sizePrices||{}), [s]: Number(e.target.value)}})} 
                                  className="w-full h-12 border border-[#E5E0D8] bg-white rounded-xl text-center font-black text-sm text-gray-900 focus:border-[#A68966] focus:ring-2 focus:ring-[#A68966]/20 outline-none transition-all" 
                                />
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">دج</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                 </form>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-[#FAFAF8] border-t border-[#E5E0D8] flex gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl border-2 border-[#E5E0D8] font-black text-gray-500 hover:bg-gray-50 transition-all">إلغاء</button>
                 <button type="submit" form="product-form" className="flex-1 h-14 rounded-2xl font-black text-white transition-all hover:opacity-90 active:scale-[0.98]" style={{background: 'linear-gradient(135deg, #C5A059, #A68946)'}}>
                    {isEditing ? '✓ تحديث البيانات' : '+ إضافة إلى المتجر'}
                 </button>
              </div>

           </div>
        </div>
      )}



      {isEditOrderModalOpen && orderToEdit && (
        <div className="fixed inset-0 bg-black/80 z-[600] flex items-center justify-center p-6 text-right">
           <div className="max-w-xl w-full bg-white p-12 rounded-3xl shadow-2xl">
              <h2 className="text-2xl font-black mb-8 italic">تعديل الطلب: #{orderToEdit.id}</h2>
              <div className="space-y-6 max-h-[50vh] overflow-y-auto mb-8">
                  {editOrderData.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-bold text-sm">{item.productName} ({item.size})</p>
                        <p className="text-[10px] font-black opacity-40">{item.price.toLocaleString()} دج</p>
                      </div>
                      <button onClick={() => removeItemFromEditOrder(idx)} className="text-red-500"><Trash2 className="h-4 w-4"/></button>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                     <Input placeholder="بحث لإضافة منتج..." value={editProductSearch} onChange={e => setEditProductSearch(e.target.value)} className="saneen-input w-full" />
                     {editProductSearch && (
                        <div className="mt-2 bg-slate-100 rounded-lg p-2 max-h-40 overflow-y-auto space-y-2">
                           {products.filter(p => p.name.toLowerCase().includes(editProductSearch.toLowerCase())).map(p => (
                             <div key={p.id} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                                <span className="text-xs font-bold">{p.name}</span>
                                <div className="flex gap-1">
                                  {Object.keys(p.stock).map(s => <button key={s} onClick={() => {addItemToEditOrder(p,s); setEditProductSearch("");}} className="px-2 py-1 bg-black text-white rounded text-[8px]">{s}</button>)}
                                </div>
                             </div>
                           ))}
                        </div>
                     )}
                  </div>
              </div>
              <div className="flex justify-between items-center text-xl font-black border-t pt-6 mb-8 uppercase">
                 <span>المجموع الجديد:</span>
                 <span className="text-[#C5A059]">{editOrderData.totalDZD?.toLocaleString()} دج</span>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setIsEditOrderModalOpen(false)} className="flex-1 h-14 font-black">إلغاء</Button>
                <button onClick={handleUpdateOrder} className="flex-1 h-14 bg-black text-white rounded-xl font-black hover:bg-[#C5A059] transition-all">حفظ التغييرات</button>
              </div>
           </div>
        </div>
      )}

      {/* PORTAL ELEMENTS (OUTSIDE ROOT) */}
      {createPortal(
        <>
          {/* THERMAL RECEIPT */}
          <div id="printable-pos-receipt">
            <div className="receipt-container text-right" dir="rtl">
              <div className="text-center mb-6">
                 <h1 className="text-2xl font-black mb-1">سنين عباية</h1>
                 <p className="text-[12px] font-bold">رقم الطلب: <span className="font-sans">#{Math.floor(Date.now()/1000).toString().slice(-6)}</span></p>
              </div>
              <table className="w-full text-[12px] text-right font-black mb-6">
                 <thead><tr className="border-b-2 border-black"><th className="py-2">المنتج</th><th className="py-2 text-center">كمية</th><th className="py-2 text-left">مجموع</th></tr></thead>
                 <tbody>
                    {posCart.map((item, idx) => (
                       <tr key={idx} className="border-b border-dotted border-black/20">
                          <td className="py-3">{item.product.name} ({item.size})</td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="py-3 text-left">{(item.price * item.quantity).toLocaleString()}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              <div className="border-t-2 border-black pt-4 flex justify-between font-black text-xl">
                 <span>المجموع:</span>
                 <span>{posCart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()} دج</span>
              </div>
            </div>
          </div>

          {/* A4 INVOICE */}
          {selectedOrder && (
            <div id="printable-invoice">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-6xl font-black text-gray-950">سنين عباية</h1>
                    <div className="h-px w-32 bg-[#C5A059] mx-auto"></div>
                    <p className="text-2xl font-black">رقم الطلب: <span className="font-sans">#{selectedOrder.id}</span></p>
                </div>
                <table className="w-full text-right mb-16 border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-gray-950 text-sm font-black border-b-2 border-black">
                            <th className="py-6 px-8">المنتج</th>
                            <th className="py-6 px-8 text-center">الكمية</th>
                            <th className="py-6 px-8 text-left">السعر</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {selectedOrder.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-8 px-8 font-black text-xl text-gray-950">{item.productName} ({item.size})</td>
                                <td className="py-8 px-8 text-center font-black text-4xl font-sans">{item.quantity}</td>
                                <td className="py-8 px-8 text-left font-black text-2xl font-sans">{item.price.toLocaleString()} دج</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pt-10 border-t-4 border-black flex justify-between items-center font-black">
                    <span className="text-4xl uppercase italic">المجموع الصافي:</span>
                    <span className="text-6xl font-sans text-slate-950">{selectedOrder.totalDZD.toLocaleString()} دج</span>
                </div>
            </div>
          )}
        </>,
        document.body
      )}

      {/* MODAL PREVIEW FOR INVOICE (NON-PORTAL UI) */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/90 z-[700] flex items-center justify-center p-6 no-print">
           <div className="max-w-4xl w-full bg-white h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                  <h3 className="text-xl font-black">معاينة الفاتورة</h3>
                  <button onClick={() => setIsInvoiceOpen(false)}><X className="h-6 w-6"/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-16">
                  {/* The actual content is also here for UI preview, but printing uses the Portal */}
                  <div className="text-center mb-16 space-y-4">
                      <h1 className="text-4xl font-black">سنين عباية</h1>
                      <p className="font-black opacity-30">رقم الطلب: #{selectedOrder.id}</p>
                  </div>
                  <table className="w-full text-right mb-10">
                      <thead className="border-b-2 border-black text-sm">
                        <tr><th className="py-4">المنتج</th><th className="py-4 text-center">الكمية</th><th className="py-4 text-left">السعر</th></tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-50"><td className="py-6 font-bold">{item.productName} ({item.size})</td><td className="py-6 text-center font-black">{item.quantity}</td><td className="py-6 text-left font-black">{item.price.toLocaleString()} دج</td></tr>
                        ))}
                      </tbody>
                  </table>
                  <div className="flex justify-between items-center pt-8 border-t-4 border-black">
                     <span className="text-2xl font-black uppercase italic">المجموع</span>
                     <span className="text-5xl font-black">{selectedOrder.totalDZD.toLocaleString()} دج</span>
                  </div>
              </div>
              <div className="p-8 bg-black">
                  <button className="saneen-btn-gold w-full h-16 flex items-center justify-center gap-4 group" onClick={() => {
                      document.body.classList.add('printing');
                      setTimeout(() => { window.print(); document.body.classList.remove('printing'); }, 200);
                  }}>
                      <Printer className="h-7 w-7" /> <span className="font-black">تأكيد وطباعة</span>
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
