"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, FileDown, Printer, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import A4Report from "@/components/A4-report";
import { getReportName, getReportNameWithoutCounter } from "@/lib/reportNameGenerator";

interface A4PreviewModalProps {
  orderId: number;
  onClose: () => void;
}

function isEmpty(val: string): boolean {
  return !val || val === "ไม่มี" || val === "-" || val.trim() === "";
}

/**
 * Build a decoration_details object from a decoration set entry.
 */
function buildDecorationDetails(set: any, defaultAdditional: string = "-") {
  return {
    printing_title: set.printTitle || "ไม่มี",
    printing_size: set.printSize || "-",
    printing_pos2_title: set.printPos2Title || "ไม่มี",
    printing_pos2_size: set.printPos2Size || "-",
    printing_pos3_title: set.printPos3Title || "ไม่มี",
    printing_pos3_size: set.printPos3Size || "-",
    printing_pos4_title: set.printPos4Title || "ไม่มี",
    printing_pos4_size: set.printPos4Size || "-",
    printing_pos5_title: "ไม่มี",
    printing_pos5_size: "-",
    embroidery_title: set.embroideryTitle || "ไม่มี",
    embroidery_size: set.embroiderySize || "-",
    embroidery_pos2_title: set.embroideryPos2Title || "ไม่มี",
    embroidery_pos2_size: set.embroideryPos2Size || "-",
    embroidery_pos3_title: set.embroideryPos3Title || "ไม่มี",
    embroidery_pos3_size: set.embroideryPos3Size || "-",
    embroidery_pos4_title: set.embroideryPos4Title || "ไม่มี",
    embroidery_pos4_size: set.embroideryPos4Size || "-",
    embroidery_pos5_title: "ไม่มี",
    embroidery_pos5_size: "-",
    additional: set.additionalNeeds || defaultAdditional,
  };
}

function splitIntoSets(data: any, orderId: number): any[] {
  // If we have full decorationSets from the API (multi-set submission), use them directly
  const decorationSets = data?.decorationSets;
  if (decorationSets && Array.isArray(decorationSets) && decorationSets.length > 0) {
    return decorationSets.map((set: any, idx: number) => {
      const setNumber = set.setNumber || idx + 1;
      // Use per-set images if available, otherwise fall back to the global design_images
      const setImages = (set.images && Array.isArray(set.images) && set.images.length > 0)
        ? set.images
        : (data?.design_images || []);
      return {
        ...data,
        _setNumber: setNumber,
        _reportName: getReportName(orderId, setNumber),
        decoration_details: buildDecorationDetails(set, data?.decoration_details?.additional || "-"),
        design_images: setImages,
      };
    });
  }

  const dd = data?.decoration_details;
  if (!dd) {
    // No decoration data - still add report name
    return [{ ...data, _setNumber: 1, _reportName: getReportName(orderId, 1) }];
  }

  const sets = [];
  for (let i = 1; i <= 5; i++) {
    const printTitleKey = i === 1 ? "printing_title" : `printing_pos${i}_title`;
    const printSizeKey = i === 1 ? "printing_size" : `printing_pos${i}_size`;
    const embTitleKey = i === 1 ? "embroidery_title" : `embroidery_pos${i}_title`;
    const embSizeKey = i === 1 ? "embroidery_size" : `embroidery_pos${i}_size`;

    const printTitle = dd[printTitleKey];
    const printSize = dd[printSizeKey];
    const embTitle = dd[embTitleKey];
    const embSize = dd[embSizeKey];

    // Skip sets where all fields are empty (always show Set 1)
    if (i > 1 && isEmpty(printTitle) && isEmpty(printSize) && isEmpty(embTitle) && isEmpty(embSize)) continue;

    const setReportName = getReportName(orderId, i);
    sets.push({
      ...data,
      _setNumber: i,
      _reportName: setReportName,
      decoration_details: {
        printing_title: printTitle || "ไม่มี",
        printing_size: printSize || "-",
        printing_pos2_title: "ไม่มี",
        printing_pos2_size: "-",
        printing_pos3_title: "ไม่มี",
        printing_pos3_size: "-",
        printing_pos4_title: "ไม่มี",
        printing_pos4_size: "-",
        printing_pos5_title: "ไม่มี",
        printing_pos5_size: "-",
        embroidery_title: embTitle || "ไม่มี",
        embroidery_size: embSize || "-",
        embroidery_pos2_title: "ไม่มี",
        embroidery_pos2_size: "-",
        embroidery_pos3_title: "ไม่มี",
        embroidery_pos3_size: "-",
        embroidery_pos4_title: "ไม่มี",
        embroidery_pos4_size: "-",
        embroidery_pos5_title: "ไม่มี",
        embroidery_pos5_size: "-",
        additional: dd.additional || "-",
      },
    });
  }

  // Ensure at least one set with report name
  if (sets.length === 0) {
    return [{ ...data, _setNumber: 1, _reportName: getReportName(orderId, 1) }];
  }
  return sets;
}

const A4PreviewModal: React.FC<A4PreviewModalProps> = ({ orderId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSavePDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const pages = reportRef.current.querySelectorAll(".tfb-report-page");
      if (pages.length === 0) return;

      const pdf = new jsPDF("p", "mm", "a4");

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const dataUrl = await toPng(page, { quality: 1.0, pixelRatio: 2 });
        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
      }

      const fileName = getReportName(orderId);
      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-2xl font-light text-black">
              A4 Report - ออเดอร์ #{orderId}
            </h2>
            <p className="text-base text-black font-light mt-0.5">
              แสดงตัวอย่างหน้า A4
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-light hover:bg-slate-50 transition-all"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleSavePDF}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-light hover:bg-slate-900 transition-all shadow-lg disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <FileDown size={16} />
              )}
              {exporting ? "กำลังสร้าง..." : "Save PDF"}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X size={20} className="text-black" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-100 p-8 print:p-0">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto text-slate-400 mb-4" size={32} />
                <p className="text-base text-black font-light">กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          ) : data ? (
            <div ref={reportRef}>
              <A4Report
                id={`a4-preview-${orderId}`}
                dataList={splitIntoSets(data, orderId)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-32">
              <p className="text-base text-black font-light">ไม่พบข้อมูลออเดอร์</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default A4PreviewModal;