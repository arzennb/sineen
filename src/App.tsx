import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/lib/cart";
import { OrdersProvider } from "@/lib/orders";
import { ProductsProvider } from "@/lib/products";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";

// استيراد الصفحات (Pages)
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Offers from "./pages/Offers";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * المحتوى الرئيسي للتطبيق (AppContent):
 * يفصل المنطق عن المتجر لتمكين التحكم في شريط التنقل (Navbar).
 */
function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/dashboard");

  return (
    <>
      <ScrollToTop />
      {/* إخفاء شريط التنقل والفوتر العاديين في صفحات الإدارة */}
      {!isAdminPage && <Navbar />}
      
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {!isAdminPage && <Footer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductsProvider>
        <OrdersProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </CartProvider>
        </OrdersProvider>
      </ProductsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
