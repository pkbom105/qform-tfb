import React from "react";
import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/toffy_logo.png" alt="Toffy Boutique" className="h-10 w-auto" />
              <div>
                <h3 className="text-lg font-light text-slate-800">ทอฟฟี่ บูติก</h3>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">TOFFY BOUTIQUE CO., LTD.</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              ผลิตเสื้อโปโลและยูนิฟอร์มครบวงจร เรายินดีให้คำปรึกษาแก่ทุกองค์กร
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-light uppercase tracking-wider text-red-500">ติดต่อเรา</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-red-500 shrink-0" />
                <span className="font-light">258 ถนน พุทธบูชา แขวงบางมด เขตจอมทอง กรุงเทพฯ 10150</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={16} className="text-red-500 shrink-0" />
                <span className="font-light">02-428-2591, 02-874-0205</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MessageCircle size={16} className="text-green-500 shrink-0" />
                <a
                  href="https://line.me/R/ti/p/@toffyboutique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-light hover:text-green-600 transition-colors"
                >
                  Line: @toffyboutique
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-light uppercase tracking-wider text-red-500">ลิงก์ด่วน</h4>
            <div className="space-y-2">
              <a href="https://tfb.co.th" target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-500 font-light hover:text-red-600 transition-colors">หน้าแรก</a>
              <a href="https://tfb.co.th/pages/past-collection/" target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-500 font-light hover:text-red-600 transition-colors">สินค้า</a>
              <a href="https://tfb.co.th/pages/process/" target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-500 font-light hover:text-red-600 transition-colors">ขั้นตอนการผลิต</a>
              <a href="/form" className="block text-sm text-slate-500 font-light hover:text-red-600 transition-colors">แบบฟอร์มสั่งผลิต</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 text-center space-y-2">
          <p className="text-xs text-slate-400 font-light">
            &copy; {new Date().getFullYear()} Toffy Boutique Co., Ltd. All rights reserved.
          </p>
          <a
            href="https://tfb.co.th"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors font-light"
          >
            <ExternalLink size={12} />
            tfb.co.th — Official Company Profile
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
