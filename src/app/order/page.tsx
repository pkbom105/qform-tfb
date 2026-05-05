"use client";
import React, { useState } from "react";

const productTypes = [
  "เสื้อยืด T-shirt", "เสื้อโปโล Polo", "เสื้อเชิ้ต Shirt", 
  "เสื้อเชิ้ตช่าง Workshop shirt", "เสื้อแม่บ้าน House Maid Uniform", 
  "เสื้อช็อป Engineer Jacket", "เสื้อเชฟ Chef Uniform", "เสื้อกั๊ก Vest", 
  "กางเกง Pant", "เสื้อแจ็คเก็ต Jacket", "เสื้อรปภ. Security Uniform", "ผ้ากันเปื้อน Apron"
];

export default function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage("✅ ส่งข้อมูลสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด");
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage("❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      setMessage("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl my-10 border border-slate-100">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">แบบฟอร์มขอใบเสนอราคา - Toffy Boutique</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ส่วนข้อมูลผู้ติดต่อ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ติดต่อ *</label>
            <input name="name" required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ชื่อ-นามสกุล" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล *</label>
            <input name="email" type="email" required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="example@mail.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">บริษัท / นามบุคคล</label>
            <input name="companyName" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ชื่อบริษัท (ถ้ามี)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ *</label>
            <input name="phone" required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0XX-XXX-XXXX" />
          </div>
        </div>

        {/* ส่วนชนิดสินค้า (Radio Group) */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-3">ชนิดสินค้าที่ต้องการสั่งผลิต *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg">
            {productTypes.map((type) => (
              <label key={type} className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded-md transition border border-transparent hover:border-slate-200">
                <input type="radio" name="productType" value={type} required className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ส่วนรายละเอียดเพิ่มเติม */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">เนื้อผ้าที่ต้องการ</label>
            <input name="fabricType" className="w-full p-2 border rounded-md" placeholder="เช่น Cotton 100%, TK, เนื้อเรียบ" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">จำนวนที่ต้องการ</label>
            <input name="quantity" className="w-full p-2 border rounded-md" placeholder="ระบุจำนวน (ตัว)" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียดรูปแบบเพิ่มเติม</label>
          <textarea name="patternDetails" rows={4} className="w-full p-2 border rounded-md" placeholder="เช่น ตำแหน่งงานปัก, งานสกรีน, หรือรายละเอียดดีไซน์"></textarea>
        </div>

        {/* ปุ่มส่งข้อมูล */}
        <div className="flex flex-col items-center border-t pt-6">
          {message && <p className={`mb-4 text-sm font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full md:w-64 py-3 px-6 text-white font-bold rounded-full transition ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-blue-700 shadow-lg'}`}
          >
            {loading ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลขอใบเสนอราคา"}
          </button>
        </div>
      </form>
    </div>
  );
}