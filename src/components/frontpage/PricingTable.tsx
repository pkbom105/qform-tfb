"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const products = [
  {
    name: "เสื้อโปโล",
    subtitle: "Polo Shirt",
    description: "เนื้อผ้าคุณภาพดี ระบายอากาศได้ดี เหมาะสำหรับองค์กร",
    features: ["Cotton 100% / TC / CVC", "ปักโลโก้หรือสกรีนได้", "หลายสีให้เลือก", "ไซส์ S - 5XL"],
    image: "/toffy_logo.png",
    popular: true,
  },
  {
    name: "เสื้อยืด",
    subtitle: "T-shirt",
    description: "เสื้อยืดคอกลม คอวี ใส่สบาย ทนทาน ราคาประหยัด",
    features: ["Cotton 100% คุณภาพดี", "สกรีน DTF / Screen", "สีสด ไม่หลุดง่าย", "ไซส์ S - 5XL"],
    image: "/toffy_logo.png",
    popular: false,
  },
  {
    name: "ยูนิฟอร์ม",
    subtitle: "Uniform",
    description: "ชุดแม่บ้าน ชุดเชฟ ชุดช่าง ชุดรปภ. และอื่นๆ",
    features: ["ดีไซน์ตามความต้องการ", "ผ้าหลากหลายชนิด", "ตัดเย็บประณีต", "ไซส์เฉพาะ可根据"],
    image: "/toffy_logo.png",
    popular: false,
  },
  {
    name: "เสื้อแจ็คเก็ต & เสื้อกั๊ก",
    subtitle: "Jacket & Vest",
    description: "สำหรับองค์กรหรือทีมงาน เน้นความคล่องตัว",
    features: ["ผ้ากันลม / กันน้ำ", "ซับในระบายอากาศ", "หลายสไตล์ให้เลือก", "พิมพ์โลโก้บริษัทได้"],
    image: "/toffy_logo.png",
    popular: false,
  },
];

const PricingTable: React.FC = () => {
  return (
    <section id="products" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-light text-red-600 uppercase tracking-[0.3em]">สินค้าของเรา</span>
          <h2 className="text-3xl lg:text-4xl font-light text-black mt-4 mb-4">
            ผลิตภัณฑ์ที่เราพร้อมให้บริการ
          </h2>
          <p className="text-slate-500 font-light max-w-2xl mx-auto">
            เราเลือกสรรวัตถุดิบและเนื้อผ้าคุณภาพดี พร้อมบริการพิมพ์และปักโลโก้ 
            เพื่อให้คุณได้รับสินค้าที่ดีที่สุดในราคาที่เหมาะสม
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.name}
              className={`relative bg-white rounded-3xl border p-8 transition-all hover:shadow-xl hover:-translate-y-1 ${
                product.popular
                  ? "border-red-200 shadow-lg shadow-red-100"
                  : "border-slate-200"
              }`}
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-light px-4 py-1 rounded-full uppercase tracking-wider">
                  แนะนำ
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                  <img src={product.image} alt={product.name} className="h-10 w-auto" />
                </div>
                <h3 className="text-xl font-light text-black">{product.name}</h3>
                <p className="text-xs text-slate-400 font-light tracking-wider uppercase mt-1">{product.subtitle}</p>
              </div>

              <p className="text-sm text-slate-500 font-light mb-6 text-center">
                {product.description}
              </p>

              <ul className="space-y-3 mb-8">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 font-light">
                    <Check size={14} className="text-green-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/"
                className="block text-center w-full py-3 rounded-full text-sm font-light border border-slate-200 text-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
              >
                สั่งผลิต
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-400 font-light mb-4">
            ไม่พบสินค้าที่ต้องการ? เรารับผลิตตามแบบที่คุณต้องการ
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-full font-light hover:bg-red-600 transition-all shadow-lg"
          >
            ปรึกษาฟรีไม่มีค่าใช้จ่าย
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;