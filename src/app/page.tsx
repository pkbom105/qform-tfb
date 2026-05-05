"use client";
import React, { useState, useMemo, useEffect } from "react";
import { 
  Plus, Trash2, Upload, Shirt, Scissors, 
  Printer, User, CheckCircle2, AlertCircle, FileText,
  Eye, EyeOff, LayoutPanelTop, Send
} from "lucide-react";
import ExportPDFButton from "@/components/ExportPDFButton";
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
  
  // States สำหรับข้อมูลฟอร์ม
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [productType, setProductType] = useState("");
  const [fabricType, setFabricType] = useState("");
  const [otherFabric, setOtherFabric] = useState("");
  const [specs, setSpecs] = useState("");
  const [sizes, setSizes] = useState({ S: "", M: "", L: "", XL: "", Other: "" });
  const [totalQuantity, setTotalQuantity] = useState(0); // เปลี่ยนเป็น Number สำหรับคำนวณ
  const [printPoints, setPrintPoints] = useState("");
  const [embroideryPositions, setEmbroideryPositions] = useState("");
  const [additionalNeeds, setAdditionalNeeds] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // ระบบคำนวณจำนวนรวมอัตโนมัติ (Auto-calculate Total)
  useEffect(() => {
    const total = Object.values(sizes).reduce((acc, val) => acc + (Number(val) || 0), 0);
    setTotalQuantity(total);
  }, [sizes]);

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
    }
  }), [name, email, companyName, phone, productType, fabricType, otherFabric, specs, sizes, totalQuantity, printPoints, embroideryPositions, additionalNeeds]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 10) val = val.slice(0, 10);
    let formatted = val;
    if (val.length > 3 && val.length <= 6) {
      formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
    } else if (val.length > 6) {
      formatted = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
    }
    setPhone(formatted);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles: File[] = [];
      if (selectedFiles.length + filesArray.length > 5) {
        alert("❌ แนบรูปได้สูงสุด 5 รูปเท่านั้น");
        return;
      }
      filesArray.forEach(file => {
        if (file.size <= 3 * 1024 * 1024) validFiles.push(file);
        else alert(`❌ ไฟล์ ${file.name} มีขนาดเกิน 3MB`);
      });
      setSelectedFiles(prev => [...prev, ...validFiles]);
      e.target.value = ""; 
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
        setMessage({ type: 'success', text: "✅ บันทึกข้อมูลเรียบร้อยแล้ว!" });
        setName(""); setEmail(""); setCompanyName(""); setPhone("");
        setProductType(""); setFabricType(""); setOtherFabric(""); setSpecs("");
        setSizes({ S: "", M: "", L: "", XL: "", Other: "" }); 
        setPrintPoints(""); setEmbroideryPositions(""); setAdditionalNeeds("");
        setSelectedFiles([]);
      } else {
        setMessage({ type: 'error', text: "❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
      }
    } catch (err) {
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 flex flex-col items-center font-kanit">
      
      {/* 1. Main Order Form */}
      <div id="printable-area" className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 mb-10">
        <div className="bg-slate-900 p-10 text-white text-center border-b-8 border-red-600">
          <h1 className="text-4xl font-bold tracking-tighter uppercase text-white">Toffy Boutique</h1>
          <p className="text-slate-400 mt-2 text-lg">Uniform Specialist - ประสบการณ์กว่า 35 ปี</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          {/* Section 1: Customer */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2">
              <User size={24} />
              <h2 className="text-xl font-bold uppercase">1. ข้อมูลผู้ติดต่อ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="ชื่อผู้ติดต่อ *" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" />
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="อีเมล *" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" />
              <input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} placeholder="บริษัท/นามบุคคล" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" />
              <input value={phone} onChange={handlePhoneChange} required placeholder="0XX-XXX-XXXX *" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-mono bg-slate-50 text-red-600 font-bold" />
            </div>
          </section>

          {/* Section 2: Product & Fabric */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2">
              <Shirt size={24} />
              <h2 className="text-xl font-bold uppercase">2. ประเภทสินค้าและเนื้อผ้า</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-3">
                <label className="block text-sm font-bold text-slate-700">เลือกประเภทสินค้า *</label>
                <div className="grid grid-cols-1 gap-1 bg-slate-50 p-1 rounded-2xl h-[610px] overflow-y-auto border border-slate-200 shadow-inner">
                  {productTypes.map(t => (
                    <label key={t} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${productType === t ? 'bg-white border-red-200' : 'border-transparent hover:bg-white group'}`}>
                      <input type="radio" name="pType" checked={productType === t} onChange={()=>setProductType(t)} required className="w-5 h-5 accent-red-600" />
                      <span className={`text-sm font-medium ${productType === t ? 'text-red-600' : 'group-hover:text-red-600'}`}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">เนื้อผ้าที่ต้องการ *</label>
                  <div className="flex flex-wrap gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                    {["Cotton 100%", "Polyester", "TC / CVC", "Other"].map(f => (
                      <label key={f} className={`flex items-center gap-3 cursor-pointer bg-white px-4 py-2 rounded-full border transition-colors ${fabricType === f ? 'border-red-500' : 'border-slate-200 hover:border-red-500'}`}>
                        <input type="radio" name="fType" checked={fabricType === f} onChange={()=>setFabricType(f)} required className="w-5 h-5 accent-red-600" />
                        <span className="text-sm font-bold text-slate-600">{f}</span>
                      </label>
                    ))}
                  </div>
                  {fabricType === "Other" && (
                    <input value={otherFabric} onChange={(e)=>setOtherFabric(e.target.value)} placeholder="ระบุเนื้อผ้าเพิ่มเติม..." className="w-full p-4 border-b-2 border-red-500 outline-none bg-transparent text-lg font-bold text-red-600" />
                  )}
                </div>
                <textarea value={specs} onChange={(e)=>setSpecs(e.target.value)} rows={3} className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" placeholder="สเปกเพิ่มเติม เช่น แขนจั๊มครึ่ง, ปกขลิบ..." />
              </div>
            </div>
          </section>

          {/* Section 3: Size Breakdown & Decor */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2">
              <Scissors size={24} />
              <h2 className="text-xl font-bold uppercase">3. จำนวนแยกตามไซซ์และงานตกแต่ง</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {["S", "M", "L", "XL", "Other"].map(s => (
                <div key={s} className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-center shadow-sm">
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Size {s}</label>
                  <input type="number" value={sizes[s as keyof typeof sizes]} onChange={(e)=>setSizes({...sizes, [s]: e.target.value})} className="w-full bg-transparent text-center text-2xl font-black outline-none border-b-2 border-slate-200 focus:border-red-500" placeholder="0" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <label className="block text-sm font-black text-red-800 mb-1">จำนวนรวมทั้งหมด (คำนวณอัตโนมัติ)</label>
                <div className="w-full p-3 bg-white border-2 border-red-200 rounded-xl text-2xl font-black text-red-600 text-center">
                  {totalQuantity}
                </div>
              </div>
              {/* จุดแก้ไข: เพิ่มหัวข้อ งานพิมพ์ และ งานปัก ภาษาไทย */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">งานพิมพ์ (ระบุจุด)</label>
                <input value={printPoints} onChange={(e)=>setPrintPoints(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500" placeholder="เช่น อกซ้าย 1 จุด" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">งานปัก (ระบุตำแหน่ง)</label>
                <input value={embroideryPositions} onChange={(e)=>setEmbroideryPositions(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500" placeholder="เช่น หลัง 1 ตำแหน่ง" />
              </div>
            </div>
          </section>

          {/* Section 4: Special Note & Files */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t pt-10">
            {/* จุดแก้ไข: คืนค่าช่องหมายเหตุพิเศษ (Special Note) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <FileText size={20} />
                <h2 className="text-xs font-black uppercase">หมายเหตุพิเศษ / รายละเอียดเพิ่มเติม</h2>
              </div>
              <textarea 
                value={additionalNeeds} 
                onChange={(e)=>setAdditionalNeeds(e.target.value)} 
                rows={6} 
                className="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="ระบุความต้องการเพิ่มเติม เช่น วันที่ต้องการใช้งาน, งบประมาณต่อตัว หรือรายละเอียดอื่นๆ..." 
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-700 uppercase">แนบแบบเสื้อ/ตัวอย่าง (สูงสุด 5 รูป)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 bg-slate-50 flex flex-col items-center justify-center min-h-[150px]">
                <Upload className="text-slate-300 mb-2" size={32} />
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-up" />
                <label htmlFor="file-up" className="cursor-pointer bg-slate-900 text-white px-8 py-2 rounded-full font-bold text-xs hover:bg-red-600 transition-all uppercase tracking-widest">Upload Design</label>
                <div className="mt-4 w-full flex flex-wrap gap-2">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border text-[10px] font-bold">
                      <span className="truncate max-w-[100px]">{f.name}</span>
                      <button type="button" onClick={()=>setSelectedFiles(selectedFiles.filter((_, idx)=>idx!==i))} className="text-red-500">X</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Line QR & Submit Section */}
          <div className="pt-10 border-t-2 border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5 bg-green-50 p-6 rounded-[2.5rem] border border-green-100 shadow-sm w-full lg:w-auto">
              <div className="bg-white p-2 rounded-2xl shadow-inner border border-green-200">
                <img src="/line-tfb.png" alt="Line" className="w-24 h-24 object-contain" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Official Line</p>
                <h3 className="text-2xl font-black text-slate-900">@toffyboutique</h3>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
              {message && (
                <div className={`mb-4 p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span className="text-sm font-black uppercase text-slate-900">{message.text}</span>
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full md:w-[400px] py-6 bg-red-600 text-white font-black rounded-full text-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
                <Send size={24} />
                {loading ? "กำลังบันทึก..." : "ยืนยันส่งข้อมูลเข้าระบบ"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Control Panel (Bottom) */}
      <div className="max-w-5xl w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-xl border border-slate-200" data-html2canvas-ignore>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-2xl text-red-600">
            <LayoutPanelTop size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">Report Management</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase">จัดการรายงานและไฟล์ดิจิทัล</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowA4Preview(!showA4Preview)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              showA4Preview 
              ? "bg-slate-800 text-white" 
              : "bg-white border-2 border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600"
            }`}
          >
            {showA4Preview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showA4Preview ? "Hide Preview" : "Show A4 Preview"}
          </button>

          <ExportPDFButton 
            targetId="tfb-report-a4" 
            data={quotationJson} 
            fileName={`TFB-Report-${phone || 'Draft'}`}
          />
        </div>
      </div>

      {/* 3. A4 Report Preview */}
      {showA4Preview && (
        <div className="mb-20 animate-in fade-in zoom-in-95 duration-300">
          <A4Report id="tfb-report-a4" data={quotationJson} />
        </div>
      )}
    </main>
  );
}