import React from 'react';

interface A4ReportProps {
  id: string;
  data: any;
}

const A4Report: React.FC<A4ReportProps> = ({ id, data }) => {
  const { customer_profile, product_specification, decoration_details, design_images } = data;
  const sizeList = ["3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

  return (
    <div 
      id={id} 
      className="w-[210mm] min-h-[297mm] p-12 bg-white mx-auto font-kanit text-slate-900 flex flex-col box-border shadow-2xl"
    >
      
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-4 border-red-600 pb-6 mb-8">
        <img src="/toffy_logo.png" alt="Logo" className="h-20 object-contain" />
        <div className="text-right text-[10px] text-slate-500 leading-relaxed uppercase font-bold">
          <h2 className="text-lg font-black text-slate-900 italic">บริษัท ทอฟฟี่ บูติก จำกัด</h2>
          <p>ผลิตเสื้อโปโลและยูนิฟอร์มครบวงจร - เรายินดีให้คำปรึกษาแก่ทุกองค์กร</p>
          <p>258 ถนน พุทธบูชา แขวง บางมด เขตจอมทอง กรุงเทพฯ 10150</p>
          <p>Tel: 02-428-2591, 02-874-0205 | Line: @toffyboutique</p>
        </div>
      </div>

      {/* TITLE */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-900 border-y border-slate-200 py-3">
          แบบฟอร์มข้อมูลออเดอร์
        </h1>
      </div>

      {/* SECTION 1: CUSTOMER INFO */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-12 text-sm mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <p><strong>ชื่อผู้ติดต่อ:</strong> <span className="text-slate-600">{customer_profile.name}</span></p>
        <p><strong>เบอร์โทรศัพท์:</strong> <span className="text-red-600 font-bold">{customer_profile.contact}</span></p>
        <p><strong>บริษัท/หน่วยงาน:</strong> <span className="text-slate-600">{customer_profile.company}</span></p>
        <p><strong>อีเมล:</strong> <span className="text-slate-600">{customer_profile.email}</span></p>
        <p><strong>Line ID:</strong> <span className="text-slate-600">{customer_profile.line_id}</span></p>
        <p><strong>วันที่ส่ง:</strong> <span className="text-slate-600">{new Date().toLocaleDateString('th-TH')}</span></p>
      </div>

      {/* SECTION 2: PRODUCT & FABRIC */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <h3 className="text-xs font-black text-red-600 uppercase tracking-wider">ประเภทสินค้าและเนื้อผ้า</h3>
          <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm">
            <p><strong>หมวดหมู่:</strong> {product_specification.category}</p>
            <p><strong>ชนิดเนื้อผ้า:</strong> {product_specification.material}</p>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-black text-red-600 uppercase tracking-wider">สเปกเพิ่มเติม</h3>
          <div className="p-4 bg-white border border-slate-200 rounded-xl h-full text-xs italic text-slate-500">
            {product_specification.details || "-"}
          </div>
        </div>
      </div>

      {/* SECTION 3: SIZE MATRIX */}
      <div className="mb-8 overflow-hidden border border-slate-200 rounded-xl">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[9px] font-black uppercase">
              <th className="p-2 border-r border-slate-700">Size</th>
              {sizeList.map(s => <th key={s} className="p-2 border-r border-slate-700">{s}</th>)}
              <th className="p-2 bg-red-600">รวม</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-[10px] bg-white">
              <td className="p-2 border-r border-slate-100 font-bold bg-slate-50">อก (นิ้ว)</td>
              {sizeList.map(s => <td key={s} className="p-2 border-r border-slate-100 text-red-600 font-bold">{product_specification.size_breakdown[s]?.chest || "-"}</td>)}
              <td className="p-2 bg-slate-50 text-slate-400">-</td>
            </tr>
            <tr className="text-[11px] bg-slate-50">
              <td className="p-2 border-r border-slate-200 font-bold">จำนวน</td>
              {sizeList.map(s => <td key={s} className="p-2 border-r border-slate-200 font-black">{product_specification.size_breakdown[s]?.qty || "0"}</td>)}
              <td className="p-2 bg-red-50 text-red-600 font-black">{product_specification.total_qty}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 4: DECORATION & NOTES (เพิ่มส่วน Note) */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
           <div className="p-4 border-l-4 border-red-600 bg-slate-50 rounded-r-xl">
             <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">งานพิมพ์ (Printing)</h4>
             <p className="text-sm font-bold">{decoration_details.printing_title} ({decoration_details.printing_size})</p>
           </div>
           <div className="p-4 border-l-4 border-slate-900 bg-slate-50 rounded-r-xl">
             <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">งานปัก (Embroidery)</h4>
             <p className="text-sm font-bold">{decoration_details.embroidery_title} ({decoration_details.embroidery_size})</p>
           </div>
        </div>
        {/* คืนค่า Note มาที่นี่ */}
        <div className="p-5 bg-yellow-50 border border-yellow-100 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10"><FileText size={40}/></div>
          <h4 className="text-[10px] font-black text-yellow-700 uppercase mb-2">หมายเหตุเพิ่มเติม (Additional Notes)</h4>
          <p className="text-xs text-yellow-900 leading-relaxed italic">{decoration_details.additional || "ไม่มีหมายเหตุเพิ่มเติม"}</p>
        </div>
      </div>

      {/* SECTION 5: ATTACHMENTS (คืนค่ารูปภาพแนบ) */}
      {design_images && design_images.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">ภาพประกอบอ้างอิง (Attachments)</h3>
          <div className="flex flex-wrap gap-4">
            {design_images.map((img: string, idx: number) => (
              <div key={idx} className="w-32 h-32 border-2 border-slate-100 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
                <img src={img} alt={`Attached ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-end">
        <div className="text-sm font-black text-slate-300 uppercase">
          {customer_profile.company}
        </div>
        <div className="text-[8px] text-slate-300 italic">
          GENERATED BY TOFFY BOUTIQUE ONLINE SYSTEM
        </div>
      </div>
    </div>
  );
};

// เพิ่มการ Import icon ที่ขาดไปในหน้า Report
import { FileText } from "lucide-react";

export default A4Report;