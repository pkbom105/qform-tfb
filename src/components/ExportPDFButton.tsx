// src/components/ExportPDFButton.tsx
"use client";
import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { FileDown, Loader2 } from "lucide-react";

interface ExportPDFButtonProps {
  targetId: string;
  fileName?: string;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ targetId, fileName = "Quotation-Data" }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      alert("ไม่พบพื้นที่สำหรับสร้าง PDF");
      return;
    }

    setIsExporting(true);

    try {
      // Step 1: Capture ข้อมูลที่จัดเรียงเป็น JSON ให้เป็นรูปภาพความละเอียดสูง
      const dataUrl = await toPng(element, { 
        quality: 1.0,
        pixelRatio: 3, // เพิ่มความคมชัดเป็นพิเศษสำหรับตัวอักษรขนาดเล็ก
        skipFonts: false, // มั่นใจว่าใช้ Font Kanit ในการ Render
      });

      // Step 2: สร้างไฟล์ PDF ขนาด A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // วางรูปภาพให้เต็มหน้า A4 พอดี
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // สั่ง Download
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white px-10 py-4 rounded-full transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] font-black uppercase italic tracking-wider disabled:opacity-50 active:scale-95"
    >
      {isExporting ? (
        <Loader2 className="animate-spin" size={22} />
      ) : (
        <FileDown size={22} />
      )}
      {isExporting ? "Processing..." : "Generate PDF (A4)"}
    </button>
  );
};

export default ExportPDFButton;