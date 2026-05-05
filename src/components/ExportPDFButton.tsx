"use client";
import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { FileDown, Loader2, FileJson } from "lucide-react";

// 1. เพิ่ม 'data: any' เข้าไปใน Interface
interface ExportPDFButtonProps {
  targetId: string;
  data: any; 
  fileName?: string;
}

// 2. รับค่า 'data' มาใช้งานใน Component
const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ 
  targetId, 
  data, 
  fileName = "Toffy-Quotation" 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  // ฟังก์ชันสำหรับดาวน์โหลดไฟล์ JSON (Step 1)
  const downloadJSON = () => {
    const jsonString = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    setIsExporting(true);
    try {
      // Step 2: สร้าง PDF จากหน้า Report
      const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);

      // ดาวน์โหลด JSON พร้อมกัน
      downloadJSON();
    } catch (error) {
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all shadow-lg font-bold disabled:opacity-50"
    >
      {isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileJson size={18} />}
      {isExporting ? "กำลังประมวลผล..." : "Export PDF + JSON"}
    </button>
  );
};

export default ExportPDFButton;