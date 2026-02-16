import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  fabric: string;
  colors: string[];
  sizes: string[];
  category: string;
  featured: boolean;
  washInstructions: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "عباءة الصلاة الكلاسيكية - أبيض",
    price: 189,
    originalPrice: 249,
    image: product1,
    images: [product1],
    description: "عباءة صلاة كلاسيكية من القطن المصري الفاخر، تتميز بالنعومة الفائقة والراحة أثناء الصلاة. تصميم أنيق مع ياقة مرتفعة وأزرار مخفية.",
    fabric: "قطن مصري 100%",
    colors: ["أبيض", "كريمي"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "كلاسيك",
    featured: true,
    washInstructions: "غسيل آلي على درجة حرارة 30°، لا تستخدم المبيض",
  },
  {
    id: "2",
    name: "عباءة الصلاة المغربية - بيج",
    price: 219,
    image: product2,
    images: [product2],
    description: "عباءة بتصميم مغربي أصيل مع تطريز يدوي دقيق على منطقة الصدر والقبة. مصنوعة من قماش الكتان الطبيعي الفاخر.",
    fabric: "كتان طبيعي",
    colors: ["بيج", "ذهبي فاتح"],
    sizes: ["S", "M", "L", "XL"],
    category: "مغربي",
    featured: true,
    washInstructions: "غسيل يدوي فقط، تجفيف في الظل",
  },
  {
    id: "3",
    name: "عباءة الصلاة العصرية - أسود",
    price: 199,
    image: product3,
    images: [product3],
    description: "عباءة عصرية بقصة مريحة وتصميم بسيط وأنيق. مثالية للصلاة اليومية والمناسبات الرسمية.",
    fabric: "بوليستر فاخر",
    colors: ["أسود"],
    sizes: ["M", "L", "XL", "XXL"],
    category: "عصري",
    featured: true,
    washInstructions: "غسيل آلي، كي على حرارة منخفضة",
  },
  {
    id: "4",
    name: "عباءة الصلاة الخفيفة - رمادي",
    price: 159,
    image: product4,
    images: [product4],
    description: "عباءة خفيفة الوزن مثالية لفصل الصيف، مصنوعة من قماش مسامي يسمح بتهوية ممتازة أثناء الصلاة.",
    fabric: "قطن خفيف",
    colors: ["رمادي فاتح", "رمادي"],
    sizes: ["S", "M", "L", "XL"],
    category: "كلاسيك",
    featured: false,
    washInstructions: "غسيل آلي على درجة حرارة 40°",
  },
  {
    id: "5",
    name: "عباءة الصلاة الفاخرة - كحلي",
    price: 279,
    originalPrice: 349,
    image: product5,
    images: [product5],
    description: "عباءة فاخرة من أجود أنواع الأقمشة، مع تفاصيل ذهبية على الأكمام والياقة. مثالية للمناسبات والأعياد.",
    fabric: "حرير مخلوط",
    colors: ["كحلي"],
    sizes: ["M", "L", "XL"],
    category: "فاخر",
    featured: true,
    washInstructions: "تنظيف جاف فقط",
  },
  {
    id: "6",
    name: "عباءة الصلاة التراثية - بني",
    price: 239,
    image: product6,
    images: [product6],
    description: "عباءة بتصميم تراثي مع زخارف إسلامية مطرزة يدوياً. تجمع بين العراقة والأناقة في تصميم فريد.",
    fabric: "قطن مع تطريز يدوي",
    colors: ["بني", "بني داكن"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "تراثي",
    featured: false,
    washInstructions: "غسيل يدوي بماء بارد",
  },
];

export const categories = ["الكل", "كلاسيك", "مغربي", "عصري", "فاخر", "تراثي"];
export const fabricTypes = ["الكل", "قطن مصري 100%", "كتان طبيعي", "بوليستر فاخر", "قطن خفيف", "حرير مخلوط", "قطن مع تطريز يدوي"];
