"use client";
import React, { useState, useMemo, useEffect } from "react";
import { 
  Plus, Trash2, Upload, Shirt, Scissors, 
  User, CheckCircle2, AlertCircle, FileText,
  Eye, EyeOff, LayoutPanelTop, Send, FileDown, Loader2
} from "lucide-react";
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

import A4Report from "@/components/A4-report";

const productTypes = [
  "เสื้อยืด T-shirt", "เสื้อโปโล Polo", "เสื้อเชิ้ต Shirt", 
  "เสื้อยืดคอกลม/วี", "เสื้อแม่บ้าน House Maid Uniform", 
  "เสื้อช็อป Engineer Jacket", "เสื้อเชฟ Chef Uniform", "เสื้อกั๊ก Vest", 
  "กางเกง Pant", "เสื้อแจ็คเก็ต Jacket", "เสื้อรปภ. Security Uniform", "ผ้ากันเปื้อน Apron"
];

export default function ToffyOrderPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showA4Preview, setShowA4Preview] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // State สำหรับปุ่ม Export PDF
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [productType, setProductType] = useState("");
  const [fabricType, setFabricType] = useState("");
  const [otherFabric, setOtherFabric] = useState("");
  const [specs, setSpecs] = useState("");
  const [sizes, setSizes] = useState({ S: "", M: "", L: "", XL: "", Other: "" });
  const [totalQuantity, setTotalQuantity] = useState(0); 
  const [printPoints, setPrintPoints] = useState("");
  const [embroideryPositions, setEmbroideryPositions] = useState("");
  const [additionalNeeds, setAdditionalNeeds] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const total = Object.values(sizes).reduce((acc, val) => acc + (Number(val) || 0), 0);
    setTotalQuantity(total);
  }, [sizes]);

 // 1. สร้าง Preview URLs จากไฟล์รูปภาพที่เลือก
  const imagePreviews = useMemo(() => {
    return selectedFiles.map(file => URL.createObjectURL(file));
  }, [selectedFiles]);

  // 2. รวมข้อมูลทั้งหมดลงใน quotationJson เพื่อส่งให้ A4Report
  const quotationJson = useMemo(() => ({
    customer_profile: { 
      name: name || "-", 
      email: email || "-", 
      company: companyName || "-", 
      contact: phone || "-" 
    },
    product_specification: { 
      category: productType || "ยังไม่ได้เลือก", 
      material: fabricType === "Other" ? otherFabric : (fabricType || "-"), 
      details: specs || "-", 
      size_breakdown: sizes, 
      total_qty: totalQuantity 
    },
    decoration_details: { 
      printing: printPoints || "ไม่มี", 
      embroidery: embroideryPositions || "ไม่มี", 
      additional: additionalNeeds || "-" 
    },
    design_images: imagePreviews // เพิ่มฟิลด์นี้เพื่อแสดงผลรูปด้านล่าง A4
  }), [
    name, email, companyName, phone, 
    productType, fabricType, otherFabric, specs, sizes, totalQuantity, 
    printPoints, embroideryPositions, additionalNeeds, 
    imagePreviews // ใส่ dependency เพื่อให้ค่าอัปเดตเมื่อมีการเพิ่มรูป
  ]);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 10) val = val.slice(0, 10);
    let formatted = val;
    if (val.length > 3 && val.length <= 6) formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
    else if (val.length > 6) formatted = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
    setPhone(formatted);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedFiles.length + filesArray.length > 5) {
        alert("❌ แนบรูปได้สูงสุด 5 รูปเท่านั้น");
        return;
      }
      const validFiles = filesArray.filter(file => file.size <= 3 * 1024 * 1024);
      setSelectedFiles(prev => [...prev, ...validFiles]);
      e.target.value = ""; 
    }
  };

  // --- ฟังก์ชันสำหรับ Save A4 PDF เท่านั้น ---
  const handleSavePDF = async () => {
    if (!showA4Preview) {
      alert("กรุณากด 'แสดงหน้า A4 Preview' เพื่อตรวจสอบความเรียบร้อยก่อนบันทึก PDF ครับ");
      return;
    }

    const element = document.getElementById('tfb-report-a4');
    if (!element) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`TFB-Report-${phone || 'Draft'}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("companyName", companyName);
    formData.append("phone", phone);
    formData.append("productType", productType);
    formData.append("fabricType", fabricType === "Other" ? `อื่นๆ: ${otherFabric}` : fabricType);
    formData.append("specs", specs);
    formData.append("sizeDetails", JSON.stringify(sizes));
    formData.append("totalQuantity", totalQuantity.toString());
    formData.append("printPoints", printPoints);
    formData.append("embroideryPositions", embroideryPositions);
    formData.append("additionalNeeds", additionalNeeds);
    selectedFiles.forEach(file => formData.append("files", file));

    try {
      const res = await fetch("/api/submit", { method: "POST", body: formData });
      if (res.ok) {
        setMessage({ type: 'success', text: "✅ บันทึกข้อมูลสำเร็จ! ทีมงาน Toffy Boutique จะติดต่อกลับครับ" });
        setName(""); setEmail(""); setCompanyName(""); setPhone(""); setProductType(""); setFabricType(""); setOtherFabric(""); setSpecs("");
        setSizes({ S: "", M: "", L: "", XL: "", Other: "" }); setPrintPoints(""); setEmbroideryPositions(""); setAdditionalNeeds(""); setSelectedFiles([]);
      } else { setMessage({ type: 'error', text: "❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล" }); }
    } catch (err) { console.error("Submission Error:", err); } finally { setLoading(false); }
  };
      // // สร้าง Preview URLs จากไฟล์ที่เลือก
      // const imagePreviews = useMemo(() => {
      //   return selectedFiles.map(file => URL.createObjectURL(file));
      // }, [selectedFiles]);      
      
  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 flex flex-col items-center font-kanit">
      
      {/* 1. แบบฟอร์มหลัก */}
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 mb-10">
        <div className="bg-slate-900 p-10 text-white text-center border-b-8 border-red-600">
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Toffy Boutique</h1>
          <p className="text-slate-400 mt-2 text-lg">Online Quotation System</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          {/* ข้อมูลลูกค้า */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2"><User size={24} /><h2 className="text-xl font-bold uppercase">1. ข้อมูลผู้ติดต่อ</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="ชื่อผู้ติดต่อ *" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" />
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="อีเมล *" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" />
              <input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} placeholder="บริษัท/หน่วยงาน" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" />
              <input value={phone} onChange={handlePhoneChange} required placeholder="0XX-XXX-XXXX *" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-mono bg-slate-50 text-red-600 font-bold" />
            </div>
          </section>

          {/* สินค้าและเนื้อผ้า */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2"><Shirt size={24} /><h2 className="text-xl font-bold uppercase">2. ประเภทสินค้าและเนื้อผ้า</h2></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-slate-50 p-4 rounded-2xl h-[620px] overflow-y-auto border">
                {productTypes.map(t => (
                  <label key={t} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-1 ${productType === t ? 'bg-white border-red-200 shadow-sm' : 'hover:bg-white'}`}>
                    <input type="radio" checked={productType === t} onChange={()=>setProductType(t)} required className="w-5 h-5 accent-red-600" />
                    <span className={`text-sm ${productType === t ? 'text-red-600 font-bold' : ''}`}>{t}</span>
                  </label>
                ))}
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border flex flex-wrap gap-4">
                  {["Cotton 100%", "Polyester", "TC / CVC", "Other"].map(f => (
                    <label key={f} className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-full border bg-white ${fabricType === f ? 'border-red-500 ring-1 ring-red-500' : ''}`}>
                      <input type="radio" checked={fabricType === f} onChange={()=>setFabricType(f)} required className="accent-red-600" />
                      <span className="text-sm font-bold">{f}</span>
                    </label>
                  ))}
                  {fabricType === "Other" && <input value={otherFabric} onChange={(e)=>setOtherFabric(e.target.value)} placeholder="ระบุเนื้อผ้า..." className="w-full mt-2 p-2 border-b-2 border-red-500 outline-none bg-transparent font-bold text-red-600" />}
                </div>
                <textarea value={specs} onChange={(e)=>setSpecs(e.target.value)} rows={4} className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" placeholder="ระบุสเปกเพิ่มเติม เช่น แขนจั๊ม, ปกขลิบ..." />
              </div>
            </div>
          </section>

          {/* ไซซ์และงานตกแต่ง */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2"><Scissors size={24} /><h2 className="text-xl font-bold uppercase">3. จำนวนแยกไซซ์และงานตกแต่ง</h2></div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {["S", "M", "L", "XL", "Other"].map(s => (
                <div key={s} className="bg-slate-50 p-4 rounded-3xl border text-center shadow-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Size {s}</label>
                  <input type="number" value={sizes[s as keyof typeof sizes]} onChange={(e)=>setSizes({...sizes, [s]: e.target.value})} className="w-full bg-transparent text-center text-2xl font-black outline-none border-b-2 border-slate-200 focus:border-red-500" placeholder="0" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100 flex flex-col justify-center items-center">
                <span className="text-xs font-black text-red-800 uppercase">รวมทั้งหมด</span>
                <span className="text-3xl font-black text-red-600">{totalQuantity} ตัว</span>
              </div>
              <input value={printPoints} onChange={(e)=>setPrintPoints(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="งานพิมพ์ (ระบุจุด)" />
              <input value={embroideryPositions} onChange={(e)=>setEmbroideryPositions(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="งานปัก (ระบุตำแหน่ง)" />
            </div>
          </section>

          {/* หมายเหตุ */}
          <section className="border-t pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600"><FileText size={20} /><h2 className="text-xs font-black uppercase">หมายเหตุเพิ่มเติม</h2></div>
              <textarea value={additionalNeeds} onChange={(e)=>setAdditionalNeeds(e.target.value)} rows={5} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500" placeholder="ความต้องการเพิ่มเติมอื่นๆ..." />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-700 uppercase">แนบไฟล์แบบเสื้อ (สูงสุด 5 รูป)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50 flex flex-col items-center justify-center min-h-[160px] group hover:border-red-400 transition-colors">
                <Upload className="text-slate-300 group-hover:text-red-400 mb-2" />
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="f-up" />
                <label htmlFor="f-up" className="cursor-pointer bg-slate-900 text-white px-8 py-2 rounded-full font-bold text-xs hover:bg-red-600 shadow-lg">เลือกไฟล์รูปภาพ</label>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedFiles.map((f, i) => <div key={i} className="text-[10px] bg-white border px-2 py-1 rounded-lg flex gap-2"><span>{f.name}</span><button type="button" onClick={()=>setSelectedFiles(selectedFiles.filter((_, idx)=>idx!==i))} className="text-red-500">x</button></div>)}
                </div>
              </div>
            </div>
          </section>

          {/* Footer Submit */}
          <div className="pt-10 border-t-2 border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 bg-green-50 p-5 rounded-3xl border border-green-100">
              <img src="/line-tfb.png" alt="Line" className="w-16 h-16 object-contain" />
              <div><p className="text-[10px] font-black text-green-700">Line Official</p><h3 className="text-xl font-black text-slate-900">@toffyboutique</h3></div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              {message && <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${message.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>{message.text}</div>}
              <button type="submit" disabled={loading} className="w-full md:w-[320px] py-5 bg-red-600 text-white font-black rounded-full text-xl shadow-xl hover:bg-slate-900 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50">
                <Send size={20} />{loading ? "บันทึก..." : "ส่งข้อมูลเสนอราคา"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Management Panel (ปุ่มควบคุม) */}
      <div className="max-w-5xl w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-2xl text-red-600"><LayoutPanelTop size={24} /></div>
          <div><h2 className="text-lg font-black uppercase text-slate-800">Report Management</h2><p className="text-[10px] font-bold text-slate-400">จัดการหน้าจอและไฟล์รายงาน</p></div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setShowA4Preview(!showA4Preview)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${showA4Preview ? "bg-slate-800 text-white" : "bg-white border-2 border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600"}`}>
            {showA4Preview ? <EyeOff size={18} /> : <Eye size={18} />} {showA4Preview ? "ซ่อน A4 Preview" : "แสดง A4 Preview"}
          </button>
          
          {/* ปุ่ม Save PDF (จะกดได้ก็ต่อเมื่อแสดงหน้า A4 แล้ว) */}
          <button 
            type="button" 
            onClick={handleSavePDF} 
            disabled={isExporting}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />} 
            {isExporting ? "กำลังบันทึก..." : "Save PDF"}
          </button>
        </div>
      </div>

      {/* 3. A4 Preview Section */}
      {showA4Preview && (
        <div className="mb-20 animate-in fade-in zoom-in-95 duration-500">
          <A4Report id="tfb-report-a4" data={quotationJson} />
        </div>
      )}
    </main>
  );
}