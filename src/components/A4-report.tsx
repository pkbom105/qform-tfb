import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { getReportName, getReportNameWithoutCounter } from "@/lib/reportNameGenerator";

interface A4ReportProps {
  id: string;
  dataList: any[];
  reportName?: string;
}

const A4Report: React.FC<A4ReportProps> = ({ id, dataList, reportName }) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxSrc(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  return (
    <div id={id} className="flex flex-col gap-10 print:gap-0">
      {dataList.map((data, index) => {
        const setNumber = data._setNumber || index + 1;
        const {
          customer_profile,
          product_specification,
          decoration_details,
          design_images,
        } = data;

        return (
          <div
            key={index}
            className="tfb-report-page w-[210mm] min-h-[297mm] p-12 bg-white mx-auto font-kanit text-black flex flex-col box-border shadow-2xl relative"
          >
            {/* Set Indicator */}
            <div className="absolute top-8 right-12 bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-light uppercase tracking-widest">
              Set {index + 1}
            </div>

            {/* HEADER + TITLE + CUSTOMER INFO: occupies 25% of A4 height */}
            <div className="h-[55.25mm] flex flex-col justify-between mb-4 overflow-hidden">
              <div className="flex justify-between items-start border-b-4 border-red-600 pb-4">
                <img src="/toffy_logo.png" alt="Logo" className="h-20 object-contain" />

                <div className="text-right text-[10px] text-black leading-relaxed uppercase font-light">
                  <h2 className="text-lg font-light text-black italic">บริษัท ทอฟฟี่ บูติก จำกัด</h2>
                  <p>
                    ผลิตเสื้อโปโลและยูนิฟอร์มครบวงจร - เรายินดีให้คำปรึกษาแก่ทุกองค์กร
                  </p>
                  <p>258 ถนน พุทธบูชา แขวง บางมด เขตจอมทอง กรุงเทพฯ 10150</p>
                  <p>Tel: 02-428-2591, 02-874-0205 | Line: @toffyboutique</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-black py-2">แบบฟอร์มข้อมูลออเดอร์</p>
                <p className="text-sm font-bold text-black py-2 uppercase tracking-wider">
                  {data._reportName || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p>
                  <strong>ชื่อผู้ติดต่อ:</strong>{" "}
                  <span className="text-black">{customer_profile.name || "-"}</span>
                </p>
                <p>
                  <strong>เบอร์โทรศัพท์:</strong>{" "}
                  <span className="text-red-600 font-light">{customer_profile.contact || "-"}</span>
                </p>
                <p>
                  <strong>บริษัท/หน่วยงาน:</strong>{" "}
                  <span className="text-black">{customer_profile.company || "-"}</span>
                </p>
                <p>
                  <strong>อีเมล:</strong>{" "}
                  <span className="text-black">{customer_profile.email || "-"}</span>
                </p>
                <p>
                  <strong>Line ID:</strong>{" "}
                  <span className="text-black">{customer_profile.line_id || "-"}</span>
                </p>
                <p>
                  <strong>วันที่ส่ง:</strong>{" "}
                  <span className="text-black">{new Date().toLocaleDateString("th-TH")}</span>
                </p>
              </div>
            </div>

            {/* SECTION 2: PRODUCT & FABRIC */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <h3 className="text-xs font-light text-red-600 uppercase tracking-wider">ประเภทสินค้าและเนื้อผ้า</h3>
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm">
                  <p>
                    <strong>หมวดหมู่:</strong> {product_specification.category}
                  </p>
                  <p>
                    <strong>ชนิดเนื้อผ้า:</strong> {product_specification.material}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-light text-red-600 uppercase tracking-wider">สเปกเพิ่มเติม</h3>
                <div className="p-4 bg-white border border-slate-200 rounded-xl h-full text-xs italic text-black">
                  {product_specification.details || "-"}
                </div>
              </div>
            </div>

            {/* SECTION 3: SIZE MATRIX */}
            <div className="mb-8 overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[9px] font-light uppercase">
                    <th className="p-2 border-r border-slate-700">Size</th>
                    {sizeList.map((s) => (
                      <th key={s} className="p-2 border-r border-slate-700">{s}</th>
                    ))}
                    <th className="p-2 bg-red-600">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-[10px] bg-white">
                    <td className="p-2 border-r border-slate-100 font-light bg-slate-50">ขนาดรอบอก (นิ้ว)</td>
                    {sizeList.map((s) => (
                      <td key={s} className="p-2 border-r border-slate-100 text-red-600 font-light">
                        {product_specification.size_breakdown[s]?.chest || "-"}
                      </td>
                    ))}
                    <td className="p-2 bg-slate-50 text-black">-</td>
                  </tr>
                  <tr className="text-[11px] bg-slate-50">
                    <td className="p-2 border-r border-slate-200 font-light">จำนวน</td>
                    {sizeList.map((s) => (
                      <td key={s} className="p-2 border-r border-slate-200 font-light">
                        {product_specification.size_breakdown[s]?.qty || "0"}
                      </td>
                    ))}
                    <td className="p-2 bg-red-50 text-red-600 font-light">{product_specification.total_qty}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION 4: DECORATION & NOTES */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
              <div className="space-y-1">
                <h4 className="text-[10px] font-light text-red-600 uppercase mb-2 pb-1 border-b border-red-100">งานพิมพ์ (Printing)</h4>
                {(() => {
                  const positions = [1, 2, 3, 4, 5].filter((pos) => {
                    const titleKey = pos === 1 ? "printing_title" : `printing_pos${pos}_title`;
                    const sizeKey = pos === 1 ? "printing_size" : `printing_pos${pos}_size`;
                    const title = decoration_details[titleKey];
                    const size = decoration_details[sizeKey];
                    return title && title !== "ไม่มี" && title !== "-" || size && size !== "ไม่มี" && size !== "-";
                  });
                  if (positions.length === 0) {
                    return <p className="text-[10px] text-slate-400 italic">ไม่มีข้อมูล</p>;
                  }
                  return positions.map((pos) => {
                    const titleKey = pos === 1 ? "printing_title" : `printing_pos${pos}_title`;
                    const sizeKey = pos === 1 ? "printing_size" : `printing_pos${pos}_size`;
                    const title = decoration_details[titleKey] || "ไม่มี";
                    const size = decoration_details[sizeKey] || "-";
                    return (
                      <div key={`print-${pos}`} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                        <span className="text-[10px] font-light text-black uppercase">ตำแหน่งที่ {pos}:</span>
                        <span className="text-[11px] font-light text-black">{title} <span className="text-black font-normal">({size})</span></span>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] font-light text-black uppercase mb-2 pb-1 border-b border-slate-200">งานปัก (Embroidery)</h4>
                {(() => {
                  const positions = [1, 2, 3, 4, 5].filter((pos) => {
                    const titleKey = pos === 1 ? "embroidery_title" : `embroidery_pos${pos}_title`;
                    const sizeKey = pos === 1 ? "embroidery_size" : `embroidery_pos${pos}_size`;
                    const title = decoration_details[titleKey];
                    const size = decoration_details[sizeKey];
                    return title && title !== "ไม่มี" && title !== "-" || size && size !== "ไม่มี" && size !== "-";
                  });
                  if (positions.length === 0) {
                    return <p className="text-[10px] text-slate-400 italic">ไม่มีข้อมูล</p>;
                  }
                  return positions.map((pos) => {
                    const titleKey = pos === 1 ? "embroidery_title" : `embroidery_pos${pos}_title`;
                    const sizeKey = pos === 1 ? "embroidery_size" : `embroidery_pos${pos}_size`;
                    const title = decoration_details[titleKey] || "ไม่มี";
                    const size = decoration_details[sizeKey] || "-";
                    return (
                      <div key={`embroidery-${pos}`} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                        <span className="text-[10px] font-light text-black uppercase">ตำแหน่งที่ {pos}:</span>
                        <span className="text-[11px] font-light text-black">{title} <span className="text-black font-normal">({size})</span></span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* SECTION 4.1: ADDITIONAL NOTES */}
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl relative overflow-hidden mb-4">
              <h4 className="text-[10px] font-light text-yellow-700 uppercase mb-1">หมายเหตุเพิ่มเติม (Additional Notes)</h4>
              <p className="text-xs text-yellow-900 leading-relaxed italic">{decoration_details.additional || "ไม่มีหมายเหตุเพิ่มเติม"}</p>
            </div>

            {/* SECTION 5: PICTURE GRID 2x2 (30% of A4) */}
            <div className="h-[89.1mm] flex flex-col">
              <h3 className="text-[10px] font-light text-black uppercase tracking-wider mb-2">ภาพประกอบอ้างอิง (Attachments)</h3>

              {(() => {
                const images = (design_images || []).filter(Boolean).slice(0, 4);
                const count = images.length;

                if (count === 0) {
                  return (
                    <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <span className="text-[8px] text-slate-300">{idx + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (count === 1) {
                  return (
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center p-2">
                        <button type="button" onClick={() => setLightboxSrc(images[0])} className="w-full h-full p-0 m-0 border-0 bg-transparent flex items-center justify-center">
                          <img src={images[0]} alt="Attachment 1" className="max-w-full max-h-full object-contain" />
                        </button>
                      </div>
                    </div>
                  );
                }

                const gridCols = 2;
                const gridRows = count === 2 ? 1 : 2;

                return (
                  <div className={`flex-1 grid gap-2 overflow-hidden grid-cols-${gridCols} grid-rows-${gridRows}`}>
                    {Array.from({ length: gridCols * gridRows }).map((_, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                        {images[idx] ? (
                          <button type="button" onClick={() => setLightboxSrc(images[idx])} className="w-full h-full p-0 m-0 border-0 bg-transparent flex items-center justify-center">
                            <img src={images[idx]} alt={`Attachment ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                          </button>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <span className="text-[8px] text-slate-300">{idx + 1}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        );
      })}

      {lightboxSrc && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="Preview" onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
};

export default A4Report;
