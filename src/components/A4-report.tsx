"use client";
import React from "react";
import { User, Shirt, Scissors, Printer, FileText, ImageIcon } from "lucide-react";

interface A4ReportProps {
  id: string;
  data: any;
}

const A4Report: React.FC<A4ReportProps> = ({ id, data }) => {
  const customer = data?.customer_profile || {};
  const product = data?.product_specification || {};
  const decoration = data?.decoration_details || {};
  const sizes = product?.size_breakdown || {};
  // รับ Array ของ Image URLs จากข้อมูลที่ส่งมา
  const images = data?.design_images || []; 

  return (
    <div 
      id={id} 
      className="w-[210mm] min-h-[297mm] bg-white p-[20mm] flex flex-col border border-slate-200 mx-auto font-kanit text-slate-900 shadow-sm print:shadow-none print:border-none"
    >
      {/* --- Header Section --- */}
      <div className="flex justify-between items-start border-b-4 border-red-600 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">
            Toffy Boutique
          </h1>
          <p className="text-slate-500 font-bold tracking-[0.2em] text-[10px] mt-1 uppercase">
            Order Summary Report
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
            Ref: TFB-{customer?.contact?.replace(/-/g, '') || "DRAFT"}
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Date: {new Date().toLocaleDateString('th-TH')}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/* --- 1. Customer Info --- */}
        <section>
          <div className="flex items-center gap-2 mb-2 text-red-600">
            <User size={16} />
            <h2 className="text-xs font-black uppercase tracking-widest">1. Customer Information</h2>
          </div>
          <div className="grid grid-cols-2 gap-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
            <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase">Name</span><span className="font-bold">{customer.name}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase">Company</span><span className="font-bold">{customer.company}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase">Contact</span><span className="font-bold text-red-600">{customer.contact}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase">Email</span><span className="font-bold">{customer.email}</span></div>
          </div>
        </section>

        {/* --- 2. Product Specs --- */}
        <section>
          <div className="flex items-center gap-2 mb-2 text-red-600">
            <Shirt size={16} />
            <h2 className="text-xs font-black uppercase tracking-widest">2. Product Specifications</h2>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase">Category</span><span className="font-bold">{product.category}</span></div>
              <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase">Material</span><span className="font-bold">{product.material}</span></div>
            </div>
            <div className="flex flex-col pt-2 border-t border-slate-200">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Additional Specs</span>
              <p className="font-medium text-slate-700 leading-relaxed italic">{product.details}</p>
            </div>
          </div>
        </section>

        {/* --- 3. Size Breakdown --- */}
        <section>
          <div className="flex items-center gap-2 mb-2 text-red-600">
            <Scissors size={16} />
            <h2 className="text-xs font-black uppercase tracking-widest">3. Size Breakdown</h2>
          </div>
          <div className="bg-slate-900 text-white p-5 rounded-xl">
            <div className="grid grid-cols-5 gap-2 text-center border-b border-slate-700 pb-3 mb-3">
              {["S", "M", "L", "XL", "Other"].map((s) => (
                <div key={s}>
                  <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Size {s}</p>
                  <p className="text-lg font-black">{sizes[s] || "0"}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 italic">Total Units</span>
              <span className="text-2xl font-black text-red-500">{product.total_qty} <span className="text-[10px] text-white">PCS</span></span>
            </div>
          </div>
        </section>

        {/* --- 4 & 5. Decoration & Note --- */}
        <section className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600"><Printer size={16} /><h2 className="text-xs font-black uppercase tracking-widest">4. Decoration</h2></div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] space-y-3">
              <div className="flex justify-between"><span>งานพิมพ์</span><span className="font-bold">{decoration.printing}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2"><span>งานปัก</span><span className="font-bold">{decoration.embroidery}</span></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600"><FileText size={16} /><h2 className="text-xs font-black uppercase tracking-widest">5. Special Note</h2></div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] min-h-[75px]">
              <p className="font-medium text-slate-600 italic leading-relaxed">{decoration.additional}</p>
            </div>
          </div>
        </section>

        {/* --- 6. Design Thumbnails (รูปภาพแนบ) --- */}
        <section className="pt-4">
          <div className="flex items-center gap-2 mb-3 text-red-600 border-t border-slate-100 pt-4">
            <ImageIcon size={16} />
            <h2 className="text-xs font-black uppercase tracking-widest">6. Design Previews / รูปภาพแนบ</h2>
          </div>
          {images.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {images.map((url: string, index: number) => (
                <div key={index} className="aspect-square bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                  <img 
                    src={url} 
                    alt={`design-preview-${index}`} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 py-6 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">No images attached / ไม่มีรูปภาพแนบ</p>
            </div>
          )}
        </section>
      </div>

      {/* --- Footer Section --- */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
          Verified by Toffy Boutique Automation System
        </p>
        <p className="text-[8px] text-slate-300 font-bold uppercase">
          A4 Page 1 of 1 • Internal Document
        </p>
      </div>
    </div>
  );
};

export default A4Report;