import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Layers, Settings, LogOut, ArrowLeft, ScanLine } from "lucide-react";

/**
 * شريط التنقل العصري (Modern Luxury Admin Navbar):
 * تصميم نظيف جداً، أيقونات ناعمة، وواجهة مستخدم عصرية (SaaS Style).
 */

export default function AdminNavbar() {
  const { hash } = useLocation();

  const links = [
    { to: "/dashboard#overview", hash: "#overview", label: "نظرة عامة", icon: LayoutDashboard },
    { to: "/dashboard#pos", hash: "#pos", label: "نظام البيع", icon: ScanLine },
    { to: "/dashboard#catalog", hash: "#catalog", label: "المنتجات", icon: Package },
    { to: "/dashboard#orders", hash: "#orders", label: "الطلبـات", icon: ShoppingCart },
    { to: "/dashboard#filters", hash: "#filters", label: "الفلاتر", icon: Layers },
    { to: "/dashboard#settings", hash: "#settings", label: "الإعدادات", icon: Settings },

  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20 fixed top-0 w-full z-[60] px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-10">
        <Link to="/dashboard#overview" className="flex items-center gap-2 group transition-all">
          <div className="h-9 w-9 bg-black rounded-xl flex items-center justify-center group-hover:bg-gold transition-colors">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900 tracking-tight leading-none mb-0.5">SANEEN</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Executive</span>
          </div>
        </Link>
        
        <ul className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = hash === link.hash || (hash === "" && link.hash === "#overview");
            
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all text-[13px] font-semibold ${
                    isActive 
                      ? "bg-black text-white shadow-lg shadow-black/10 scale-105" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-gold' : ''}`} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-2">
           <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-green-700 uppercase">Live System</span>
        </div>
        <div className="h-8 w-px bg-gray-100 mx-2" />
        <Link 
          to="/" 
          className="h-10 px-4 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          المتجر
        </Link>
        <button 
          onClick={() => { sessionStorage.removeItem("admin_auth"); window.location.href = "/dashboard"; }}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
