"use client";
import React from "react";
import { User, Shirt, Scissors, Printer, FileText, CheckCircle2 } from "lucide-react";

interface A4ReportProps {
  id: string;
  data: any;
}

const A4Report: React.FC<A4ReportProps> = ({ id, data }) => {
  // Helper สำหรับการดึงข้อมูลเพื่อให้โค้ดสะอาดขึ้น
  const customer = data?.customer_profile || {};
  const product = data?.product_specification || {};
  const decoration = data?.decoration_details || {};
  const sizes = product?.size_breakdown || {};

  return (
    <div 
      id={id} 
      className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[20mm] flex flex-col border border-slate-200 mx-auto font-kanit text-slate-900"
    >
      {/* --- Header --- */}
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

      <div className="flex-1 space-y-8">
        {/* --- 1. ข้อมูลลูกค้า (List Format) --- */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <User size={18} />
            <h2 className="text-sm font-black uppercase tracking-widest">1. Customer Information</h2>
          </div>
          <div className="grid grid-cols-2 gap-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Name</span>
              <span className="font-bold">{customer.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Company</span>
              <span className="font-bold">{customer.company}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</span>
              <span className="font-bold text-red-600">{customer.contact}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
              <span className="font-bold">{customer.email}</span>
            </div>
          </div>
        </section>

        {/* --- 2. รายละเอียดสินค้า (List Format) --- */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <Shirt size={18} />
            <h2 className="text-sm font-black uppercase tracking-widest">2. Product Specifications</h2>
          </div>
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                <span className="font-bold">{product.category}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Material</span>
                <span className="font-bold">{product.material}</span>
              </div>
            </div>
            <div className="flex flex-col pt-2 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pattern Details</span>
              <p className="font-medium text-slate-700 leading-relaxed">{product.details}</p>
            </div>
          </div>
        </section>

        {/* --- 3. จำนวนและไซซ์ (Grid List) --- */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <Scissors size={18} />
            <h2 className="text-sm font-black uppercase tracking-widest">3. Size Breakdown & Quantity</h2>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <div className="grid grid-cols-5 gap-4 text-center border-b border-slate-700 pb-4 mb-4">
              {Object.keys(sizes).map((s) => (
                <div key={s}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Size {s}</p>
                  <p className="text-xl font-black">{sizes[s] || "0"}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Production Quantity</span>
              <span className="text-3xl font-black text-red-500">{product.total_qty} <span className="text-sm text-white">PCS</span></span>
            </div>
          </div>
        </section>

        {/* --- 4. งานตกแต่งและหมายเหตุ (List Format) --- */}
        <section className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <Printer size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">4. Decoration</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-3">
              <div className="flex justify-between">
                <span className="font-bold text-slate-400 uppercase">Printing</span>
                <span className="font-bold">{decoration.printing}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-400 uppercase">Embroidery</span>
                <span className="font-bold">{decoration.embroidery}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <FileText size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">5. Special Notes</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs h-[80px]">
              <p className="font-medium text-slate-600">{decoration.additional}</p>
            </div>
          </div>
        </section>
      </div>

      {/* --- Footer --- */}
      <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Verified by TFB System v2.0</p>
        </div>
        <p className="text-[8px] text-slate-300 font-bold uppercase">Toffy Boutique Management System • A4 Page 1 of 1</p>
      </div>
    </div>
  );
};

export default A4Report;