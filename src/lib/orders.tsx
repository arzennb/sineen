import { createContext, useContext, useState, ReactNode, useEffect } from "react";

/**
 * حالات الطلب المتوافقة مع السوق الجزائري (Yalidine/Zr Logic)
 */
export type OrderStatus = "قيد التحضير" | "تم التسليم" | "ملغى" | "مكتمل";

export const initialWilayaFees: Record<string, number> = {
  "01 - Adrar": 1200, "02 - Chlef": 600, "03 - Laghouat": 800, "04 - Oum El Bouaghi": 600,
  "05 - Batna": 600, "06 - Béjaïa": 600, "07 - Biskra": 800, "08 - Béchar": 1000,
  "09 - Blida": 400, "10 - Bouira": 500, "11 - Tamanrasset": 1500, "12 - Tébessa": 700,
  "13 - Tlemcen": 600, "14 - Tiaret": 600, "15 - Tizi Ouzou": 500, "16 - Alger": 400,
  "17 - Djelfa": 700, "18 - Jijel": 600, "19 - Sétif": 600, "20 - Saïda": 600,
  "21 - Skikda": 600, "22 - Sidi Bel Abbès": 600, "23 - Annaba": 600, "24 - Guelma": 600,
  "25 - Constantine": 600, "26 - Médéa": 500, "27 - Mostaganem": 600, "28 - M'Sila": 600,
  "29 - Mascara": 600, "30 - Ouargla": 1000, "31 - Oran": 600, "32 - El Bayadh": 800,
  "33 - Illizi": 1500, "34 - Bordj Bou Arréridj": 600, "35 - Boumerdès": 400, "36 - El Tarf": 600,
  "37 - Tindouf": 1500, "38 - Tissemsilt": 600, "39 - El Oued": 900, "40 - Khenchela": 700,
  "41 - Souk Ahras": 600, "42 - Tipaza": 400, "43 - Mila": 600, "44 - Aïn Defla": 500,
  "45 - Naâma": 900, "46 - Aïn Témouchent": 600, "47 - Ghardaïa": 900, "48 - Relizane": 600,
  "49 - Timimoun": 1200, "50 - Bordj Badji Mokhtar": 1500, "51 - Ouled Djellal": 800, "52 - Béni Abbès": 1000,
  "53 - In Salah": 1500, "54 - In Guezzam": 1500, "55 - Touggourt": 900, "56 - Djanet": 1500,
  "57 - El M'Ghair": 800, "58 - El Meniaa": 900
};

export const algerianWilayas = Object.keys(initialWilayaFees);

export interface OrderItem {
  productName: string;
  quantity: number;
  size: string;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerWilaya: string; // الولايات الـ 58
  customerAddress?: string;
  deliveryType: "Yalidine" | "Zr Express" | "محل";
  items: OrderItem[];
  totalDZD: number;
  status: OrderStatus;
  isOnlineOrder: boolean; // تمييز بين طلبات الموقع والمحل (Hybrid)
  deliveryFee?: number;
}

interface OrdersContextType {
  orders: Order[];
  wilayaFees: Record<string, number>;
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => void;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  updateOrder: (orderId: string, updatedOrder: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  updateWilayaFee: (wilaya: string, fee: number) => void;
  getTotalRevenue: (source: 'online' | 'store') => number;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [wilayaFees, setWilayaFees] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("saneen_wilaya_fees");
      return saved ? JSON.parse(saved) : initialWilayaFees;
    } catch {
      return initialWilayaFees;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("saneen_orders_dzd");
      if (saved) {
        const parsed = JSON.parse(saved);
        setOrders(Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS);
      } else {
        setOrders(INITIAL_ORDERS);
        localStorage.setItem("saneen_orders_dzd", JSON.stringify(INITIAL_ORDERS));
      }
    } catch (e) {
      setOrders(INITIAL_ORDERS);
    }
  }, []);

  const INITIAL_ORDERS: Order[] = [
    {
      id: "DZ-112233",
      date: "10/4/2026",
      customerName: "سارة أحمد",
      customerPhone: "0555123456",
      customerWilaya: "16 - Alger",
      customerAddress: "الجزائر الوسطى",
      deliveryType: "Yalidine",
      items: [{ productName: "عباءة كلاسيكية فاخرة", quantity: 1, size: "54", price: 8500 }],
      totalDZD: 8500,
      status: "تم التسليم",
      isOnlineOrder: true,
    },
    {
      id: "DZ-445566",
      date: "11/4/2026",
      customerName: "فاطمة الزهراء",
      customerPhone: "0666987654",
      customerWilaya: "31 - Oran",
      customerAddress: "حي العقيد لطفي",
      deliveryType: "Zr Express",
      items: [{ productName: "عباءة بشت بلمسة عصرية", quantity: 2, size: "56", price: 12500 }],
      totalDZD: 25000,
      status: "قيد التحضير",
      isOnlineOrder: true,
    },
    {
      id: "DZ-778899",
      date: "12/4/2026",
      customerName: "زبون محلي",
      customerPhone: "0000000000",
      customerWilaya: "بيع مباشر",
      items: [{ productName: "عباءة بشت بلمسة عصرية", quantity: 1, size: "54", price: 12500 }],
      totalDZD: 12500,
      status: "مكتمل",
      isOnlineOrder: false,
    }
  ];


  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("saneen_orders_dzd", JSON.stringify(newOrders));
  };

  const updateWilayaFee = (wilaya: string, fee: number) => {
    const newFees = { ...wilayaFees, [wilaya]: fee };
    setWilayaFees(newFees);
    localStorage.setItem("saneen_wilaya_fees", JSON.stringify(newFees));
  };

  const addOrder = (order: Omit<Order, "id" | "date" | "status">) => {
    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const newOrder: Order = {
      ...order,
      id: `DZ-${Date.now().toString().slice(-6)}`,
      date: formattedDate,
      status: "قيد التحضير",
    };
    saveOrders([newOrder, ...orders]);
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    saveOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const updateOrder = (orderId: string, updatedOrder: Partial<Order>) => {
    saveOrders(orders.map((o) => (o.id === orderId ? { ...o, ...updatedOrder } : o)));
  };

  const deleteOrder = (id: string) => {
    saveOrders(orders.filter(o => o.id !== id));
  };

  const getTotalRevenue = (source: 'online' | 'store') => {
    return orders
      .filter(o => (source === 'online' ? o.isOnlineOrder : !o.isOnlineOrder) && o.status === "تم التسليم")
      .reduce((sum, o) => sum + o.totalDZD, 0);
  };

  return (
    <OrdersContext.Provider value={{ orders, wilayaFees, addOrder, updateStatus, updateOrder, deleteOrder, updateWilayaFee, getTotalRevenue }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
