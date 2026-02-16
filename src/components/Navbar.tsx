import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/products", label: "المنتجات" },
  { to: "/offers", label: "العروض" },
  { to: "/about", label: "عن المتجر" },
  { to: "/contact", label: "تواصل معنا" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-heading text-4xl font-bold text-accent drop-shadow-md tracking-wider hover:scale-105 transition-transform">
          سنين
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`relative text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === l.to ? "text-accent" : "text-foreground"
                }`}
              >
                {l.label}
                {location.pathname === l.to && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 hover:text-accent transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs gold-gradient text-accent-foreground border-0">
                    {totalItems}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border bg-card overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-4">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium ${
                      location.pathname === l.to ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
