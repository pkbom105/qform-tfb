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
  "อื่นๆ (Other)",
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
  const [isExporting, setIsExporting] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");

  // Product & Fabric States
  const [productType, setProductType] = useState("");
  const [otherProductType, setOtherProductType] = useState("");
  const [fabricType, setFabricType] = useState("");
  const [otherFabric, setOtherFabric] = useState("");
  const [specs, setSpecs] = useState("");

  // Sizes & Chest Data
  const [sizeData, setSizeData] = useState<
    Record<string, { qty: string; chest: string }>
  >(
    [...sizeList, "Other"].reduce(
      (acc, size) => ({
        ...acc,
        [size]: { qty: "", chest: defaultChestSizes[size] || "" },
      }),
      {},
    ),
  );
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [manualTotal, setManualTotal] = useState("");

  // Decoration States
  const [printTitle, setPrintTitle] = useState("");
  const [printSize, setPrintSize] = useState("");
  const [embroideryTitle, setEmbroideryTitle] = useState("");
  const [embroiderySize, setEmbroiderySize] = useState("");

  const [additionalNeeds, setAdditionalNeeds] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const total = Object.values(sizeData).reduce(
      (acc, val) => acc + (Number(val.qty) || 0),
      0,
    );
    setTotalQuantity(total);
  }, [sizeData]);

  const imagePreviews = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  const quotationJson = useMemo(
    () => ({
      customer_profile: {
        name: name || "-",
        email: email || "-",
        company: companyName || "Toffy Boutique",
        contact: phone || "-",
        line_id: lineId || "-",
      },
      product_specification: {
        category:
          productType === "อื่นๆ (Other)"
            ? otherProductType
            : productType || "ยังไม่ได้เลือก",
        material: fabricType === "Other" ? otherFabric : fabricType || "-",
        details: specs || "-",
        size_breakdown: sizeData,
        total_qty: manualTotal || totalQuantity,
      },
      decoration_details: {
        printing_title: printTitle || "ไม่มี",
        printing_size: printSize || "-",
        embroidery_title: embroideryTitle || "ไม่มี",
        embroidery_size: embroiderySize || "-",
        additional: additionalNeeds || "-", // Note กลับมาแล้ว
      },
      design_images: imagePreviews, // Attachments กลับมาแล้ว
    }),
    [
      name,
      email,
      companyName,
      phone,
      lineId,
      productType,
      otherProductType,
      fabricType,
      otherFabric,
      specs,
      sizeData,
      totalQuantity,
      manualTotal,
      printTitle,
      printSize,
      embroideryTitle,
      embroiderySize,
      additionalNeeds,
      imagePreviews,
    ],
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedFiles.length + filesArray.length > 5) {
        alert("❌ แนบรูปได้สูงสุด 5 รูปเท่านั้น");
        return;
      }
      const validFiles = filesArray.filter(
        (file) => file.size <= 3 * 1024 * 1024,
      );
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleSavePDF = async () => {
    if (!showA4Preview) {
      alert("กรุณากด 'แสดงหน้า A4 Preview'");
      return;
    }
    const element = document.getElementById("tfb-report-a4");
    if (!element) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        210,
        (element.offsetHeight * 210) / element.offsetWidth,
      );
      pdf.save(`TFB-Report-${phone || "Draft"}.pdf`);
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
      formData.append(
        "productType",
        productType === "อื่นๆ (Other)" ? otherProductType : productType,
      );
      formData.append(
        "fabricType",
        fabricType === "Other" ? otherFabric : fabricType,
      );
      formData.append("specs", specs);
      formData.append("sizeDetails", JSON.stringify(sizeData));
      formData.append("finalTotal", String(manualTotal || totalQuantity));
      formData.append("printTitle", printTitle);
      formData.append("printSize", printSize);
      formData.append("embroideryTitle", embroideryTitle);
      formData.append("embroiderySize", embroiderySize);
      formData.append("additionalNeeds", additionalNeeds);
      selectedFiles.forEach((file) => formData.append("files", file));

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
        setProductType("");
        setFabricType("");
        setSpecs("");
        setAdditionalNeeds("");
        setPrintTitle("");
        setPrintSize("");
        setEmbroideryTitle("");
        setEmbroiderySize("");
        setManualTotal("");
        setSelectedFiles([]);
        setSizeData(
          [...sizeList, "Other"].reduce(
            (acc, size) => ({ ...acc, [size]: { qty: "", chest: "" } }),
            {},
          ),
        );
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
        <div className="flex justify-between items-start border-b-4 border-red-600 pb-6 mb-8">
          <div className="flex-shrink-0 ml-8 mt-8">
            <img
              src="/toffy_logo.png"
              alt="Toffy Boutique Logo"
              className="h-24 w-auto object-contain"
            />
          </div>

          <div className="text-right flex flex-col gap-5 mr-10 mt-8">
            <h2 className="text-2xl font-black text-slate-900 leading-none italic uppercase">
              บริษัท ทอฟฟี่ บูติก จำกัด
            </h2>
            <p className="text-xl font-bold text-red-600">
              TOFFY BOUTIQUE CO., LTD.
            </p>
            <div className="mt-2 text-[12px] text-slate-500 leading-tight font-medium">
              <p>
                ผลิตเสื้อโปโลและยูนิฟอร์มครบวงจร -
                เรายินดีให้คำปรึกษาแก่ทุกองค์กร
              </p>
              <p>258 ถนน พุทธบูชา แขวง บางมด เขตจอมทอง กรุงเทพฯ 10150</p>
              <div className="flex justify-end gap-3 mt-1 font-bold text-slate-700">
                <span>Tel: 02-428-2591, 02-874-0205</span>
                <span className="text-slate-300">|</span>
                <span className="text-green-600">Line: @toffyboutique</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-900 border-y-2 border-slate-100 py-3 inline-block px-10">
            แบบฟอร์มข้อมูลออเดอร์
          </h1>
          <p className="text-[10px] text-slate-400 mt-2 font-bold tracking-[0.3em]">
            ORDER INFORMATION FORM
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          {/* Section 1: ข้อมูลผู้ติดต่อ */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2">
              <User size={24} />
              <h2 className="text-xl font-bold uppercase">
                1. ข้อมูลผู้ติดต่อ
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="ชื่อผู้ติดต่อ *"
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="อีเมล *"
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
              />
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="บริษัท/หน่วยงาน"
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
              />
              <input
                value={phone}
                onChange={handlePhoneChange}
                required
                placeholder="0XX-XXX-XXXX *"
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-mono bg-slate-50 text-red-600 font-bold"
              />
              <input
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                placeholder="Line ID"
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
              />
            </div>
          </section>

          {/* Section 2: เนื้อผ้าและประเภทสินค้า */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2">
              <Shirt size={24} />
              <h2 className="text-xl font-bold uppercase">
                2. เนื้อผ้าและประเภทสินค้า
              </h2>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-black text-slate-700 uppercase">
                  ประเภทสินค้า
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {productTypes.map((t) => (
                    <label
                      key={t}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${productType === t ? "bg-red-50 border-red-200 shadow-sm" : "bg-white hover:bg-slate-50"}`}
                    >
                      <input
                        type="radio"
                        checked={productType === t}
                        onChange={() => setProductType(t)}
                        required
                        className="w-5 h-5 accent-red-600"
                      />
                      <span
                        className={`text-xs ${productType === t ? "text-red-600 font-bold" : "text-slate-600"}`}
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
                {productType === "อื่นๆ (Other)" && (
                  <input
                    value={otherProductType}
                    onChange={(e) => setOtherProductType(e.target.value)}
                    placeholder="ระบุประเภทสินค้า..."
                    className="w-full p-3 border-b-2 border-red-500 outline-none bg-slate-50 font-bold text-red-600"
                  />
                )}
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border space-y-4">
                <label className="text-sm font-black text-slate-700 uppercase">
                  เลือกเนื้อผ้า
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Cotton 100%", "Polyester", "TC / CVC", "Other"].map(
                    (f) => (
                      <label
                        key={f}
                        className={`flex items-center gap-3 cursor-pointer px-6 py-3 rounded-full border bg-white transition-all ${fabricType === f ? "border-red-500 ring-2 ring-red-500 shadow-md" : "hover:border-slate-300"}`}
                      >
                        <input
                          type="radio"
                          checked={fabricType === f}
                          onChange={() => setFabricType(f)}
                          required
                          className="accent-red-600 w-4 h-4"
                        />
                        <span className="text-sm font-bold">{f}</span>
                      </label>
                    ),
                  )}
                </div>
                {fabricType === "Other" && (
                  <input
                    value={otherFabric}
                    onChange={(e) => setOtherFabric(e.target.value)}
                    placeholder="ระบุเนื้อผ้า..."
                    className="w-full mt-2 p-3 border-b-2 border-red-500 outline-none bg-white rounded-t-lg font-bold text-red-600"
                  />
                )}
              </div>
              <textarea
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                rows={3}
                className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-inner"
                placeholder="รายละเอียดสเปกเพิ่มเติม..."
              />
            </div>
          </section>

          {/* Section 3: จำนวนแยกไซซ์และงานตกแต่ง */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-red-600 border-b pb-2">
              <Scissors size={24} />
              <h2 className="text-xl font-bold uppercase">
                3. จำนวนแยกไซซ์และงานตกแต่ง
              </h2>
            </div>

            <div className="overflow-x-auto pb-4">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="border p-2 bg-slate-50 w-32"></th>
                    {sizeList.map((s) => (
                      <th
                        key={s}
                        className="border p-2 bg-green-500 text-white font-bold text-sm"
                      >
                        {s}
                      </th>
                    ))}
                    <th className="border p-2 bg-slate-800 text-white font-bold text-sm">
                      Other
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-bold text-sm bg-slate-50 text-slate-700 leading-tight">
                      ขนาดรอบอก (นิ้ว)
                      <div className="text-[10px] text-red-500 font-medium">
                        (แก้ไขได้)
                      </div>
                    </td>
                    {sizeList.map((s) => (
                      <td key={s} className="border p-0">
                        <input
                          type="text"
                          value={sizeData[s].chest}
                          onChange={(e) =>
                            setSizeData({
                              ...sizeData,
                              [s]: { ...sizeData[s], chest: e.target.value },
                            })
                          }
                          className="w-full h-12 text-center font-bold outline-none focus:bg-red-50 transition-colors bg-white hover:bg-slate-50"
                          title="คลิกเพื่อแก้ไขขนาดรอบอก"
                        />
                      </td>
                    ))}
                    <td className="border p-0">
                      <input
                        type="text"
                        placeholder="ระบุไซซ์..."
                        value={sizeData["Other"].chest}
                        onChange={(e) =>
                          setSizeData({
                            ...sizeData,
                            ["Other"]: {
                              ...sizeData["Other"],
                              chest: e.target.value,
                            },
                          })
                        }
                        className="w-full h-12 text-center text-xs font-bold outline-none focus:bg-red-50 transition-colors"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-bold text-sm bg-slate-50 text-slate-700">
                      จำนวน (ตัว)
                    </td>
                    {sizeList.map((s) => (
                      <td key={s} className="border p-0">
                        <input
                          type="number"
                          placeholder="-"
                          value={sizeData[s].qty}
                          onChange={(e) =>
                            setSizeData({
                              ...sizeData,
                              [s]: { ...sizeData[s], qty: e.target.value },
                            })
                          }
                          className="w-full h-12 text-center font-black text-red-600 outline-none focus:bg-red-50 transition-colors"
                        />
                      </td>
                    ))}
                    <td className="border p-0">
                      <input
                        type="number"
                        placeholder="-"
                        value={sizeData["Other"].qty}
                        onChange={(e) =>
                          setSizeData({
                            ...sizeData,
                            ["Other"]: {
                              ...sizeData["Other"],
                              qty: e.target.value,
                            },
                          })
                        }
                        className="w-full h-12 text-center font-black text-red-600 outline-none focus:bg-red-50 transition-colors"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden h-[62px]">
                  <div className="bg-slate-100 px-4 py-3 font-bold text-[13px] text-slate-600 w-32 border-r">
                    ยอดรวมจากตาราง
                  </div>
                  <div className="flex-1 px-4 py-3 text-xl font-black text-slate-900 bg-white">
                    {totalQuantity}
                  </div>
                </div>
                <div className="flex items-center border-2 border-red-500 rounded-xl overflow-hidden h-[62px]">
                  <div className="bg-red-50 px-4 py-3 font-bold text-[13px] text-red-600 w-32 border-r">
                    ยอดรวมโดยประมาณ
                  </div>
                  <input
                    type="number"
                    value={manualTotal}
                    onChange={(e) => setManualTotal(e.target.value)}
                    className="flex-1 px-4 py-3 text-xl font-black outline-none bg-white"
                    placeholder="ระบุ..."
                  />
                </div>
              </div>

              {/* งานพิมพ์ */}
              <div className="p-4 bg-slate-50 rounded-2xl border space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-black uppercase">
                    งานพิมพ์ (Screen / DTF)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    value={printTitle}
                    onChange={(e) => setPrintTitle(e.target.value)}
                    className="p-2 bg-white border rounded-lg outline-none text-xs"
                    placeholder="หัวข้อ/จุดที่พิมพ์"
                  />
                  <input
                    value={printSize}
                    onChange={(e) => setPrintSize(e.target.value)}
                    className="p-2 bg-white border rounded-lg outline-none text-xs"
                    placeholder="ขนาด"
                  />
                </div>
              </div>

              {/* งานปัก */}
              <div className="p-4 bg-slate-50 rounded-2xl border space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-black uppercase">
                    งานปัก (Embroidery)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    value={embroideryTitle}
                    onChange={(e) => setEmbroideryTitle(e.target.value)}
                    className="p-2 bg-white border rounded-lg outline-none text-xs"
                    placeholder="หัวข้อ/ตำแหน่งที่ปัก"
                  />
                  <input
                    value={embroiderySize}
                    onChange={(e) => setEmbroiderySize(e.target.value)}
                    className="p-2 bg-white border rounded-lg outline-none text-xs"
                    placeholder="ขนาด"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: ระบุหมายเหตุ (แก้ไขได้) */}
          <section className="border-t pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <FileText size={20} />
                <h2 className="text-xl font-bold uppercase">
                  4. ระบุหมายเหตุ (แก้ไขได้)
                </h2>
              </div>
              <textarea
                value={additionalNeeds}
                onChange={(e) => setAdditionalNeeds(e.target.value)}
                rows={5}
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                placeholder="ระบุหมายเหตุหรือความต้องการเพิ่มเติมอื่นๆ..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-700 uppercase">
                แนบไฟล์แบบเสื้อ (สูงสุด 5 รูป)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50 flex flex-col items-center justify-center min-h-[160px] group hover:border-red-400 transition-colors">
                <Upload className="text-slate-300 group-hover:text-red-400 mb-2" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="f-up"
                />
                <label
                  htmlFor="f-up"
                  className="cursor-pointer bg-slate-900 text-white px-8 py-2 rounded-full font-bold text-xs hover:bg-red-600 shadow-lg"
                >
                  เลือกไฟล์รูปภาพ
                </label>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="text-[10px] bg-white border px-2 py-1 rounded-lg flex gap-2"
                    >
                      <span className="truncate max-w-[100px]">{f.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles(
                            selectedFiles.filter((_, idx) => idx !== i),
                          )
                        }
                        className="text-red-500"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Message Feedback */}
          {message && (
            <div
              className={`p-4 rounded-2xl font-bold text-center text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
            >
              {message.text}
            </div>
          )}

          {/* Footer Submit */}

          <div className="pt-10 border-t-2 border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 bg-green-50 p-5 rounded-3xl border border-green-100">
              <img
                src="/line-tfb.png"
                alt="Line"
                className="w-30 h-30 object-contain"
              />
              <div>
                <p className="text-[15px] font-black text-green-700">
                  Line Official
                </p>
                <h3 className="text-xl font-black text-slate-900">
                  @toffyboutique
                </h3>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-[320px] py-5 bg-red-600 text-white font-black rounded-full text-xl shadow-xl hover:bg-slate-900 transition-all flex justify-center items-center gap-3 disabled:opacity-50"
            >
              <Send size={20} />
              {loading ? "บันทึก..." : "ส่งข้อมูลเสนอราคา"}
            </button>
          </div>
        </form>
      </div>

      {/* Control Panel */}
      <div className="max-w-6xl w-full mb-8 flex justify-end gap-3 bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setShowA4Preview(!showA4Preview)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${showA4Preview ? "bg-slate-800 text-white" : "bg-white border-2 border-slate-200 text-slate-600"}`}
        >
          {showA4Preview ? <EyeOff size={18} /> : <Eye size={18} />}{" "}
          {showA4Preview ? "ซ่อนพรีวิว" : "แสดงหน้า A4 Preview"}
        </button>
        <button
          type="button"
          onClick={handleSavePDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
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
          <A4Report id="tfb-report-a4" data={quotationJson} />
        </div>
      )}
    </main>
  );
}
