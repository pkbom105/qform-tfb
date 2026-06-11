import React from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/toffy_logo.png" alt="Toffy Boutique" className="h-10 w-auto brightness-0 invert" />
              <div>
                <h3 className="text-lg font-light">ทอฟฟี่ บูติก</h3>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">TOFFY BOUTIQUE CO., LTD.</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              ผลิตเสื้อโปโลและยูนิฟอร์มครบวงจร เรายินดีให้คำปรึกษาแก่ทุกองค์กร
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-light uppercase tracking-wider text-slate-400">ติดต่อเรา</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin size={16} className="text-red-400 shrink-0" />
                <span className="font-light">258 ถนน พุทธบูชา แขวงบางมด เขตจอมทอง กรุงเทพฯ 10150</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone size={16} className="text-red-400 shrink-0" />
                <span className="font-light">02-428-2591, 02-874-0205</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MessageCircle size={16} className="text-green-400 shrink-0" />
                <span className="font-light">Line: @toffyboutique</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-light uppercase tracking-wider text-slate-400">ลิงก์ด่วน</h4>
            <div className="space-y-2">
              <a href="/" className="block text-sm text-slate-300 font-light hover:text-white transition-colors">หน้าแรก</a>
              <a href="/#products" className="block text-sm text-slate-300 font-light hover:text-white transition-colors">สินค้า</a>
              <a href="/#process" className="block text-sm text-slate-300 font-light hover:text-white transition-colors">ขั้นตอนการผลิต</a>
              <a href="/order" className="block text-sm text-slate-300 font-light hover:text-white transition-colors">แบบฟอร์มสั่งผลิต</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center">
          <p className="text-xs text-slate-500 font-light">
            &copy; {new Date().getFullYear()} Toffy Boutique Co., Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;