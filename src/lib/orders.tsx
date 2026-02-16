import { createContext, useContext, useState, ReactNode } from "react";

export type OrderStatus = "جديد" | "قيد التجهيز" | "تم الشحن" | "مكتمل";

export interface OrderItem {
  productName: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  paymentMethod: "card" | "cod";
  status: OrderStatus;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => void;
  updateStatus: (orderId: string, status: OrderStatus) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2026-02-14",
      customerName: "أحمد محمد",
      customerPhone: "0501234567",
      customerEmail: "ahmed@example.com",
      customerAddress: "الرياض، حي النزهة",
      items: [{ productName: "عباءة الصلاة الكلاسيكية - أبيض", quantity: 2, size: "L", color: "أبيض", price: 189 }],
      total: 378,
      paymentMethod: "cod",
      status: "جديد",
    },
    {
      id: "ORD-002",
      date: "2026-02-13",
      customerName: "خالد عبدالله",
      customerPhone: "0559876543",
      customerEmail: "khaled@example.com",
      customerAddress: "جدة، حي الروضة",
      items: [
        { productName: "عباءة الصلاة الفاخرة - كحلي", quantity: 1, size: "XL", color: "كحلي", price: 279 },
        { productName: "عباءة الصلاة المغربية - بيج", quantity: 1, size: "M", color: "بيج", price: 219 },
      ],
      total: 498,
      paymentMethod: "card",
      status: "قيد التجهيز",
    },
    {
      id: "ORD-003",
      date: "2026-02-12",
      customerName: "عمر سعد",
      customerPhone: "0541112233",
      customerEmail: "omar@example.com",
      customerAddress: "الدمام، حي الفيصلية",
      items: [{ productName: "عباءة الصلاة العصرية - أسود", quantity: 1, size: "M", color: "أسود", price: 199 }],
      total: 199,
      paymentMethod: "cod",
      status: "تم الشحن",
    },
  ]);

  const addOrder = (order: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      status: "جديد",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
