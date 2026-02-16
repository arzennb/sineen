import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-heading text-xl font-bold mb-4">عباءات الصلاة</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            نوفر لكم أجود أنواع العباءات الرجالية للصلاة، مصنوعة من أفخر الأقمشة بتصاميم تجمع بين الأصالة والعصرية.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold mb-4">روابط سريعة</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/products" className="hover:opacity-100 transition-opacity">المنتجات</Link></li>
            <li><Link to="/offers" className="hover:opacity-100 transition-opacity">العروض</Link></li>
            <li><Link to="/about" className="hover:opacity-100 transition-opacity">عن المتجر</Link></li>
            <li><Link to="/contact" className="hover:opacity-100 transition-opacity">تواصل معنا</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold mb-4">تواصل معنا</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>البريد: info@prayer-robes.com</li>
            <li>الهاتف: +966 50 123 4567</li>
            <li>العنوان: الرياض، المملكة العربية السعودية</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 py-4">
        <p className="text-center text-sm opacity-60">© 2026 عباءات الصلاة. جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
