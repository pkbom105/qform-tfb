"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Shirt,
  Scissors,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
  LayoutPanelTop,
  Send,
  FileDown,
  Loader2,
} from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import A4Report from "@/components/A4-report";
import ContactSection from "@/components/ContactSection";
import OrderTabs from "@/components/OrderTabs";
import QuotationForm from "@/components/QuotationForm";
import { getReportName } from "@/lib/reportNameGenerator";

const productTypes = [
  "เสื้อยืด T-shirt",
  "เสื้อโปโล Polo",
  "เสื้อเชิ้ต Shirt",
  "เสื้อยืดคอกลม/วี",
  "เสื้อแม่บ้าน House Maid Uniform",
  "เสื้อช็อป Engineer Jacket",
  "เสื้อเชฟ Chef Uniform",
  "เสื้อกั๊ก Vest",
  "กางเกง Pant",
  "เสื้อแจ็คเก็ต Jacket",
  "เสื้อรปภ. Security Uniform",
  "ผ้ากันเปื้อน Apron",
];

const fabricTypes = [
  "Cotton 100%",
  "Polyester",
  "TC",
  "CVC",
  "อื่นๆ (ระบุในหมายเหตุ)",
];

const sizeList = [
  "4XS",
  "3XS",
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
];

const defaultChestSizes: Record<string, string> = {
  "4XS": "28",
  "3XS": "30",
  XXS: "32",
  XS: "34",
  S: "36",
  M: "38",
  L: "40",
  XL: "42",
  XXL: "44",
  "3XL": "46",
  "4XL": "48",
  "5XL": "50",
};

export default function ToffyOrderPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showA4Preview, setShowA4Preview] = useState(false);
  const [reportName, setReportName] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");

  // Tabs with Product, Fabric, Size, and Decoration States
  const [decorationTabs, setDecorationTabs] = useState<
    Array<{
      id: string;
      // Section 2: Product & Fabric
      productType: string;
      fabricType: string;
      specs: string;
      // Section 3: Size Breakdown
      sizeData: Record<string, { qty: string; chest: string }>;
      totalQuantity: number;
      manualTotal: string;
      // Section 4: Decoration & Remarks
      printTitle: string;
      printSize: string;
      printPos2Title: string;
      printPos2Size: string;
      printPos3Title: string;
      printPos3Size: string;
      printPos4Title: string;
      printPos4Size: string;
      embroideryTitle: string;
      embroiderySize: string;
      embroideryPos2Title: string;
      embroideryPos2Size: string;
      embroideryPos3Title: string;
      embroideryPos3Size: string;
      embroideryPos4Title: string;
      embroideryPos4Size: string;
      additionalNeeds: string;
      selectedFiles: File[]; // Add selectedFiles to each tab
    }>
  >([
    {
      id: "set-1",
      // Section 2
      productType: "",
      fabricType: "",
      specs: "",
      // Section 3
      sizeData: sizeList.reduce(
        (acc, size) => ({
          ...acc,
          [size]: { qty: "", chest: defaultChestSizes[size] || "" },
        }),
        {},
      ),
      totalQuantity: 0,
      manualTotal: "",
      // Section 4
      printTitle: "",
      printSize: "",
      printPos2Title: "",
      printPos2Size: "",
      printPos3Title: "",
      printPos3Size: "",
      printPos4Title: "",
      printPos4Size: "",
      embroideryTitle: "",
      embroiderySize: "",
      embroideryPos2Title: "",
      embroideryPos2Size: "",
      embroideryPos3Title: "",
      embroideryPos3Size: "",
      embroideryPos4Title: "",
      embroideryPos4Size: "",
      additionalNeeds: "",
      selectedFiles: [], // Initialize empty for new tabs
    },
  ]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const addTab = () => {
    if (decorationTabs.length < 5) {
      const newTab = {
        id: `set-${decorationTabs.length + 1}`,
        // Section 2
        productType: "",
        fabricType: "",
        specs: "",
        // Section 3
        sizeData: sizeList.reduce(
          (acc, size) => ({
            ...acc,
            [size]: { qty: "", chest: defaultChestSizes[size] || "" },
          }),
          {},
        ),
        totalQuantity: 0,
        manualTotal: "",
        // Section 4
        printTitle: "",
        printSize: "",
        printPos2Title: "",
        printPos2Size: "",
        printPos3Title: "",
        printPos3Size: "",
        printPos4Title: "",
        printPos4Size: "",
        embroideryTitle: "",
        embroiderySize: "",
        embroideryPos2Title: "",
        embroideryPos2Size: "",
        embroideryPos3Title: "",
        embroideryPos3Size: "",
        embroideryPos4Title: "",
        embroideryPos4Size: "",
        additionalNeeds: "",
        selectedFiles: [], // Initialize empty for new tabs
      };
      setDecorationTabs([...decorationTabs, newTab]);
      setActiveTabIndex(decorationTabs.length);
    }
  };

  const removeTab = (index: number) => {
    if (decorationTabs.length > 1) {
      const newTabs = decorationTabs.filter((_, i) => i !== index);
      setDecorationTabs(newTabs);
      setActiveTabIndex(Math.max(0, activeTabIndex - 1));
    }
  };

  const updateTab = (
    index: number,
    updates: Partial<(typeof decorationTabs)[0]>,
  ) => {
    const newTabs = [...decorationTabs];
    newTabs[index] = { ...newTabs[index], ...updates };
    setDecorationTabs(newTabs);
  };

  const currentTab = decorationTabs[activeTabIndex];

  // Colors for each set
  const setColors = [
    {
      border: "border-red-600",
      text: "text-red-600",
      bg: "bg-red-600",
      lightBg: "bg-red-50",
      ring: "ring-red-500",
      accent: "accent-red-600",
    },
    {
      border: "border-blue-600",
      text: "text-blue-600",
      bg: "bg-blue-600",
      lightBg: "bg-blue-50",
      ring: "ring-blue-500",
      accent: "accent-blue-600",
    },
    {
      border: "border-green-600",
      text: "text-green-600",
      bg: "bg-green-600",
      lightBg: "bg-green-50",
      ring: "ring-green-500",
      accent: "accent-green-600",
    },
    {
      border: "border-orange-600",
      text: "text-orange-600",
      bg: "bg-orange-600",
      lightBg: "bg-orange-50",
      ring: "ring-orange-500",
      accent: "accent-orange-600",
    },
    {
      border: "border-purple-600",
      text: "text-purple-600",
      bg: "bg-purple-600",
      lightBg: "bg-purple-50",
      ring: "ring-purple-500",
      accent: "accent-purple-600",
    },
  ];
  const activeColor = setColors[activeTabIndex % setColors.length];

  useEffect(() => {
    if (currentTab) {
      const total = Object.values(currentTab.sizeData).reduce(
        (acc, val) => acc + (Number(val.qty) || 0),
        0,
      );
      updateTab(activeTabIndex, { totalQuantity: total });
    }
  }, [currentTab?.sizeData]);

  const imagePreviews = useMemo(() => {
    // This now returns a map of tabId to its image URLs
    return decorationTabs.reduce(
      (acc, tab) => {
        acc[tab.id] = tab.selectedFiles.map((file) =>
          URL.createObjectURL(file),
        );
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, [decorationTabs]);

  // Remove global selectedFiles state from dependencies as it's now per tab
  // const quotationDataList = useMemo(
  //   () =>
  //     decorationTabs.map((tab) => ({

  const allQuotationData = useMemo(
    () =>
      decorationTabs.map((tab) => ({
        customer_profile: {
          name: name || "-",
          email: email || "-",
          company: companyName || "Toffy Boutique",
          contact: phone || "-",
          line_id: lineId || "-",
        },
        product_specification: {
          category: tab.productType || "ยังไม่ได้เลือก",
          material: tab.fabricType || "-",
          details: tab.specs || "-",
          size_breakdown: tab.sizeData || {},
          total_qty: tab.manualTotal || tab.totalQuantity || 0,
        },
        decoration_details: {
          printing_title: tab.printTitle || "ไม่มี",
          printing_size: tab.printSize || "-",
          printing_pos2_title: tab.printPos2Title || "ไม่มี",
          printing_pos2_size: tab.printPos2Size || "-",
          printing_pos3_title: tab.printPos3Title || "ไม่มี",
          printing_pos3_size: tab.printPos3Size || "-",
          printing_pos4_title: tab.printPos4Title || "ไม่มี",
          printing_pos4_size: tab.printPos4Size || "-",
          embroidery_title: tab.embroideryTitle || "ไม่มี",
          embroidery_size: tab.embroiderySize || "-",
          embroidery_pos2_title: tab.embroideryPos2Title || "ไม่มี",
          embroidery_pos2_size: tab.embroideryPos2Size || "-",
          embroidery_pos3_title: tab.embroideryPos3Title || "ไม่มี",
          embroidery_pos3_size: tab.embroideryPos3Size || "-",
          embroidery_pos4_title: tab.embroideryPos4Title || "ไม่มี",
          embroidery_pos4_size: tab.embroideryPos4Size || "-",
          additional: tab.additionalNeeds || "-",
        },
        design_images: imagePreviews[tab.id] || [],
      })),
    [name, email, companyName, phone, lineId, decorationTabs, imagePreviews],
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 10) val = val.slice(0, 10);
    let formatted = val;
    if (val.length > 3 && val.length <= 6)
      formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
    else if (val.length > 6)
      formatted = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
    setPhone(formatted);
  };

  // New handleFileChange for per-tab files
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    tabId: string,
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const currentTab = decorationTabs.find((tab) => tab.id === tabId);
      if (!currentTab) return;

      if (currentTab.selectedFiles.length + filesArray.length > 5) {
        alert("❌ แนบรูปได้สูงสุด 5 รูปเท่านั้น");
        return;
      }
      const validFiles = filesArray.filter(
        (file) => file.size <= 3 * 1024 * 1024,
      );

      const newSelectedFiles = [...currentTab.selectedFiles, ...validFiles];
      updateTab(
        decorationTabs.findIndex((tab) => tab.id === tabId),
        { selectedFiles: newSelectedFiles },
      );
    }
  };

  // No longer needed global handleFileChange
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const filesArray = Array.from(e.target.files);
  //     if (selectedFiles.length + filesArray.length > 5) {
  //       alert("❌ แนบรูปได้สูงสุด 5 รูปเท่านั้น");
  //       return;
  //     }
  //     const validFiles = filesArray.filter(
  //       (file) => file.size <= 3 * 1024 * 1024,
  //     );
  //     setSelectedFiles((prev) => [...prev, ...validFiles]);
  //   }
  // };

  const handleSavePDF = async () => {
    if (!showA4Preview) {
      alert("กรุณากด 'แสดงหน้า A4 Preview'");
      return;
    }
    const pages = document.querySelectorAll(".tfb-report-page");
    if (pages.length === 0) return;

    setIsExporting(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const dataUrl = await toPng(page, { quality: 1.0, pixelRatio: 2 });

        if (i > 0) pdf.addPage();

        pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
      }

      const reportName = getReportName();
      pdf.save(`${reportName}.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("companyName", companyName);
      formData.append("phone", phone);
      formData.append("lineId", lineId);
      formData.append("decorationTabs", JSON.stringify(decorationTabs));

      // Append files from all tabs
      decorationTabs.forEach((tab) => {
        tab.selectedFiles.forEach((file) =>
          formData.append(`files-${tab.id}`, file),
        );
      });

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "✅ ส่งข้อมูลเรียบร้อยแล้ว! ทีมงานจะติดต่อกลับโดยเร็ว",
        });
        // Reset form
        setName("");
        setEmail("");
        setCompanyName("");
        setPhone("");
        setLineId("");
        // Reset selectedFiles for all tabs
        setDecorationTabs((prevTabs) =>
          prevTabs.map((tab) => ({ ...tab, selectedFiles: [] })),
        );
        setDecorationTabs([
          {
            id: "set-1",
            productType: "",
            fabricType: "",
            specs: "",
            sizeData: sizeList.reduce(
              (acc, size) => ({
                ...acc,
                [size]: { qty: "", chest: defaultChestSizes[size] || "" },
              }),
              {},
            ),
            totalQuantity: 0,
            manualTotal: "",
            printTitle: "",
            printSize: "",
            printPos2Title: "",
            printPos2Size: "",
            printPos3Title: "",
            printPos3Size: "",
            printPos4Title: "",
            printPos4Size: "",
            embroideryTitle: "",
            embroiderySize: "",
            embroideryPos2Title: "",
            embroideryPos2Size: "",
            embroideryPos3Title: "",
            embroideryPos3Size: "",
            embroideryPos4Title: "",
            embroideryPos4Size: "",
            additionalNeeds: "",
            selectedFiles: [], // Reset for initial tab
          },
        ]);
        setActiveTabIndex(0);
      } else {
        setMessage({ type: "error", text: `❌ เกิดข้อผิดพลาด: ${data.error}` });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 flex flex-col items-center font-kanit">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 mb-10">
        {/* 1. Header Section: Logo ซ้าย | Info ขวา */}
        <div className="flex justify-between items-start border-b-4 border-red-500 pb-6 mb-8">
          <div className="flex-shrink-0 ml-8 mt-8">
            <img
              src="/toffy_logo.png"
              alt="Toffy Boutique Logo"
              className="h-24 w-auto object-contain"
            />
          </div>

          <div className="text-right flex flex-col gap-5 mr-10 mt-8">
            <h2 className="text-2xl font-light text-black leading-none italic uppercase">
              บริษัท ทอฟฟี่ บูติก จำกัด
            </h2>
            <p className="text-xl font-light text-red-600">
              TOFFY BOUTIQUE CO., LTD.
            </p>
            <div className="mt-2 text-[12px] text-black leading-tight font-medium">
              <p>
                ผลิตเสื้อโปโลและยูนิฟอร์มครบวงจร -
                เรายินดีให้คำปรึกษาแก่ทุกองค์กร
              </p>
              <p>258 ถนน พุทธบูชา แขวง บางมด เขตจอมทอง กรุงเทพฯ 10150</p>
              <div className="flex justify-end gap-3 mt-1 font-light text-black">
                <span>Tel: 02-428-2591, 02-874-0205</span>
                <span className="text-black">|</span>
                <span className="text-green-600">Line: @toffyboutique</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light uppercase tracking-[0.2em] text-black border-y-2 border-slate-100 py-3 inline-block px-10">
            แบบฟอร์มข้อมูลออเดอร์
          </h1>
          <p className="text-[10px] text-black mt-2 font-light tracking-[0.3em]">
            ORDER INFORMATION FORM
          </p>
        </div>

        <QuotationForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          companyName={companyName}
          setCompanyName={setCompanyName}
          phone={phone}
          handlePhoneChange={handlePhoneChange}
          lineId={lineId}
          setLineId={setLineId}
          decorationTabs={decorationTabs}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          addTab={addTab}
          updateTab={updateTab}
          setColors={setColors}
          productTypes={productTypes}
          fabricTypes={fabricTypes}
          sizeList={sizeList}
          currentTab={currentTab}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          message={message}
          loading={loading}
        />
      </div>

      {/* Control Panel */}
      <div className="max-w-6xl w-full mb-8 flex justify-end gap-3 bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
        <button
          type="button"
          onClick={() => {
            if (!showA4Preview) {
              setReportName(getReportName());
            }
            setShowA4Preview(!showA4Preview);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-light transition-all ${showA4Preview ? "bg-slate-800 text-white" : "bg-white border-2 border-slate-200 text-black"}`}
        >
          {showA4Preview ? <EyeOff size={18} /> : <Eye size={18} />}{" "}
          {showA4Preview ? "ซ่อนพรีวิว" : "แสดงหน้า A4 Preview"}
        </button>
        <button
          type="button"
          onClick={handleSavePDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-light shadow-lg"
        >
          {isExporting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <FileDown size={18} />
          )}{" "}
          Save PDF
        </button>
      </div>

      {showA4Preview && (
        <div className="mb-20 animate-in fade-in zoom-in-95 duration-500">
          <A4Report id="tfb-report-a4" dataList={allQuotationData} reportName={reportName} />
        </div>
      )}
    </main>
  );
}
