import React, { createContext, useContext, useState, useEffect } from "react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

export interface Product {
  id: string;
  name: string;
  basePriceDZD: number;
  sizePrices: Record<string, number>;
  discountPercent: number;
  image: string;
  description: string;
  fabric: string;
  fabricType: string;
  cut: string;
  colors: string[];
  sizes: string[];
  category: string;
  featured: boolean;
  isPublished: boolean;
  stock: Record<string, number>;
  reorderLevel: number;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "عباءة كلاسيكية فاخرة",
    basePriceDZD: 8500,
    sizePrices: { "52": 8500, "54": 8500, "56": 8500, "58": 9000, "60": 9500 },
    discountPercent: 10,
    image: product1,
    description: "تصميم كلاسيكي أسود من قماش الإنترنت الرفيع.",
    fabric: "إنترنت أصلي",
    fabricType: "إنترنت",
    cut: "كلوش",
    colors: ["أسود"],
    sizes: ["52", "54", "56", "58", "60"],
    category: "كلاسيك",
    featured: true,
    isPublished: true,
    stock: { "52": 2, "54": 5, "56": 8, "58": 1, "60": 0 },
    reorderLevel: 2
  }
];

interface ProductsContextType {
  products: Product[];
  sizes: string[];
  cuts: string[];
  fabrics: string[];
  categories: string[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  sellInStore: (productId: string, size: string) => void;
  getProductPrice: (product: Product, size: string) => number;
  updateFilter: (type: 'sizes' | 'cuts' | 'fabrics' | 'categories', action: 'add' | 'remove', value: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<string[]>(["52", "54", "56", "58", "60"]);
  const [cuts, setCuts] = useState<string[]>(["كلوش", "بشت", "فراشة", "أخرى"]);
  const [fabrics, setFabrics] = useState<string[]>(["كريب", "حرير", "إنترنت", "كتان"]);
  const [categories, setCategories] = useState<string[]>(["الكل", "كلاسيك", "بشت", "فراشة", "رسمي", "فاخر"]);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("saneen_products_dynamic");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      else setProducts(INITIAL_PRODUCTS);

      const savedFilters = localStorage.getItem("saneen_filters");
      if (savedFilters) {
        const f = JSON.parse(savedFilters);
        if (f.sizes) setSizes(f.sizes);
        if (f.cuts) setCuts(f.cuts);
        if (f.fabrics) setFabrics(f.fabrics);
        if (f.categories) setCategories(f.categories);
      }
    } catch (e) {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  const saveFilters = (newSizes: string[], newCuts: string[], newFabrics: string[], newCats: string[]) => {
    localStorage.setItem("saneen_filters", JSON.stringify({ sizes: newSizes, cuts: newCuts, fabrics: newFabrics, categories: newCats }));
  };

  const updateFilter = (type: 'sizes' | 'cuts' | 'fabrics' | 'categories', action: 'add' | 'remove', value: string) => {
    let nSizes = [...sizes], nCuts = [...cuts], nFabrics = [...fabrics], nCats = [...categories];
    
    if (action === 'add') {
      if (type === 'sizes') nSizes.push(value);
      if (type === 'cuts') nCuts.push(value);
      if (type === 'fabrics') nFabrics.push(value);
      if (type === 'categories') nCats.push(value);
    } else {
      if (type === 'sizes') nSizes = nSizes.filter(v => v !== value);
      if (type === 'cuts') nCuts = nCuts.filter(v => v !== value);
      if (type === 'fabrics') nFabrics = nFabrics.filter(v => v !== value);
      if (type === 'categories') nCats = nCats.filter(v => v !== value);
    }

    setSizes(nSizes); setCuts(nCuts); setFabrics(nFabrics); setCategories(nCats);
    saveFilters(nSizes, nCuts, nFabrics, nCats);
  };

  const getProductPrice = (product: Product, size: string) => {
    if (!product) return 0;
    const base = product.basePriceDZD || 0;
    const originalPrice = (size && product.sizePrices && product.sizePrices[size]) ? product.sizePrices[size] : base;
    if (product.discountPercent > 0) return Math.round(originalPrice * (1 - product.discountPercent / 100));
    return originalPrice;
  };

  const saveAndSet = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("saneen_products_dynamic", JSON.stringify(newProducts));
  };

  const addProduct = (p: Omit<Product, "id">) => {
    const newProduct = { ...p, id: Date.now().toString() };
    saveAndSet([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    saveAndSet(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    saveAndSet(products.filter(p => p.id !== id));
  };

  const sellInStore = (productId: string, size: string) => {
    saveAndSet(products.map(p => {
      if (p.id === productId && p.stock[size] > 0) return { ...p, stock: { ...p.stock, [size]: p.stock[size] - 1 } };
      return p;
    }));
  };

  return (
    <ProductsContext.Provider value={{ 
      products, sizes, cuts, fabrics, categories, 
      addProduct, updateProduct, deleteProduct, sellInStore, getProductPrice, updateFilter 
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within ProductsProvider");
  return context;
}
