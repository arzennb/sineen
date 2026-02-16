import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: Mail, label: "البريد الإلكتروني", value: "info@prayer-robes.com" },
  { icon: Phone, label: "الهاتف", value: "+966 50 123 4567" },
  { icon: MapPin, label: "العنوان", value: "الرياض، المملكة العربية السعودية" },
];

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "تم إرسال رسالتك", description: "سنتواصل معك في أقرب وقت ممكن" });
  };

  return (
    <div className="container py-10">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">تواصل معنا</h1>
      <p className="text-muted-foreground mb-10">نسعد بتواصلكم ونرحب باستفساراتكم</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><Label>الاسم</Label><Input required placeholder="اسمك الكامل" className="mt-1" /></div>
          <div><Label>البريد الإلكتروني</Label><Input required type="email" placeholder="email@example.com" className="mt-1" /></div>
          <div><Label>الموضوع</Label><Input placeholder="موضوع الرسالة" className="mt-1" /></div>
          <div><Label>الرسالة</Label><Textarea required rows={5} placeholder="اكتب رسالتك هنا..." className="mt-1" /></div>
          <Button type="submit" size="lg" className="gold-gradient border-0 text-foreground font-bold">إرسال الرسالة</Button>
        </form>

        <div className="space-y-6">
          {contactInfo.map((c, i) => (
            <div key={i} className="flex items-center gap-4 bg-card rounded-lg border border-border p-5">
              <div className="h-12 w-12 rounded-full gold-gradient flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="font-medium text-foreground">{c.value}</p>
              </div>
            </div>
          ))}

          {/* Map placeholder */}
          <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463876.9931806945!2d46.54233!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1234567890"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="موقع المتجر"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
