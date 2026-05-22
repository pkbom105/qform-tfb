import React from "react";
import { FileText } from "lucide-react";
import { getReportNameWithoutCounter } from "@/lib/reportNameGenerator";

interface A4ReportProps {
  id: string;
  dataList: any[];
  reportName?: string;
}

const A4Report: React.FC<A4ReportProps> = ({ id, dataList, reportName }) => {
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

            {/* HEADER */}
            <div className="flex justify-between items-start border-b-4 border-red-600 pb-6 mb-8">
              <img
                src="/toffy_logo.png"
                alt="Logo"
                className="h-20 object-contain"
              />
              <div className="text-right text-[10px] text-black leading-relaxed uppercase font-light">
                <h2 className="text-lg font-light text-black italic">
                  บริษัท ทอฟฟี่ บูติก จำกัด
                </h2>
                <p>
                  ผลิตเสื้อโปโลและยูนิฟอร์มครบวงจร -
                  เรายินดีให้คำปรึกษาแก่ทุกองค์กร
                </p>
                <p>258 ถนน พุทธบูชา แขวง บางมด เขตจอมทอง กรุงเทพฯ 10150</p>
                <p>Tel: 02-428-2591, 02-874-0205 | Line: @toffyboutique</p>
              </div>
            </div>

            {/* TITLE */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-md font-light text-black py-2">
                แบบฟอร์มข้อมูลออเดอร์
              </p>
              {reportName && (
                <p className="text-sm font-light text-black py-2 uppercase tracking-wider">
                  {reportName}-{String(index + 1).padStart(4, "0")}
                </p>
              )}
            </div>

            {/* SECTION 1: CUSTOMER INFO */}
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs mb-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <p>
                <strong>ชื่อผู้ติดต่อ:</strong>{" "}
                <span className="text-black">
                  {customer_profile.name || "-"}
                </span>
              </p>
              <p>
                <strong>เบอร์โทรศัพท์:</strong>{" "}
                <span className="text-red-600 font-light">
                  {customer_profile.contact || "-"}
                </span>
              </p>
              <p>
                <strong>บริษัท/หน่วยงาน:</strong>{" "}
                <span className="text-black">
                  {customer_profile.company || "-"}
                </span>
              </p>
              <p>
                <strong>อีเมล:</strong>{" "}
                <span className="text-black">
                  {customer_profile.email || "-"}
                </span>
              </p>
              <p>
                <strong>Line ID:</strong>{" "}
                <span className="text-black">
                  {customer_profile.line_id || "-"}
                </span>
              </p>
              <p>
                <strong>วันที่ส่ง:</strong>{" "}
                <span className="text-black">
                  {new Date().toLocaleDateString("th-TH")}
                </span>
              </p>
            </div>

            {/* SECTION 2: PRODUCT & FABRIC */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <h3 className="text-xs font-light text-red-600 uppercase tracking-wider">
                  ประเภทสินค้าและเนื้อผ้า
                </h3>
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm">
                  <p>
                    <strong>หมวดหมู่:</strong> {product_specification.category}
                  </p>
                  <p>
                    <strong>ชนิดเนื้อผ้า:</strong>{" "}
                    {product_specification.material}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-light text-red-600 uppercase tracking-wider">
                  สเปกเพิ่มเติม
                </h3>
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
                      <th key={s} className="p-2 border-r border-slate-700">
                        {s}
                      </th>
                    ))}
                    <th className="p-2 bg-red-600">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-[10px] bg-white">
                    <td className="p-2 border-r border-slate-100 font-light bg-slate-50">
                      ขนาดรอบอก (นิ้ว)
                    </td>
                    {sizeList.map((s) => (
                      <td
                        key={s}
                        className="p-2 border-r border-slate-100 text-red-600 font-light"
                      >
                        {product_specification.size_breakdown[s]?.chest || "-"}
                      </td>
                    ))}
                    <td className="p-2 bg-slate-50 text-black">-</td>
                  </tr>
                  <tr className="text-[11px] bg-slate-50">
                    <td className="p-2 border-r border-slate-200 font-light">
                      จำนวน
                    </td>
                    {sizeList.map((s) => (
                      <td
                        key={s}
                        className="p-2 border-r border-slate-200 font-light"
                      >
                        {product_specification.size_breakdown[s]?.qty || "0"}
                      </td>
                    ))}
                    <td className="p-2 bg-red-50 text-red-600 font-light">
                      {product_specification.total_qty}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION 4: DECORATION & NOTES */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
              <div className="space-y-1">
                <h4 className="text-[10px] font-light text-red-600 uppercase mb-2 pb-1 border-b border-red-100">
                  งานพิมพ์ (Printing)
                </h4>
                {[1, 2, 3, 4].map((pos) => {
                  const titleKey =
                    pos === 1 ? "printing_title" : `printing_pos${pos}_title`;
                  const sizeKey =
                    pos === 1 ? "printing_size" : `printing_pos${pos}_size`;
                  const title = decoration_details[titleKey] || "ไม่มี";
                  const size = decoration_details[sizeKey] || "-";

                  if (title === "ไม่มี" && size === "-" && pos !== 1)
                    return null;

                  return (
                    <div
                      key={`print-${pos}`}
                      className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-[10px] font-light text-black uppercase">
                        ตำแหน่งที่ {pos}:
                      </span>
                      <span className="text-[11px] font-light text-black">
                        {title}{" "}
                        <span className="text-black font-normal">
                          ({size})
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-light text-black uppercase mb-2 pb-1 border-b border-slate-200">
                  งานปัก (Embroidery)
                </h4>
                {[1, 2, 3, 4].map((pos) => {
                  const titleKey =
                    pos === 1
                      ? "embroidery_title"
                      : `embroidery_pos${pos}_title`;
                  const sizeKey =
                    pos === 1 ? "embroidery_size" : `embroidery_pos${pos}_size`;
                  const title = decoration_details[titleKey] || "ไม่มี";
                  const size = decoration_details[sizeKey] || "-";

                  if (title === "ไม่มี" && size === "-" && pos !== 1)
                    return null;

                  return (
                    <div
                      key={`embroidery-${pos}`}
                      className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-[10px] font-light text-black uppercase">
                        ตำแหน่งที่ {pos}:
                      </span>
                      <span className="text-[11px] font-light text-black">
                        {title}{" "}
                        <span className="text-black font-normal">
                          ({size})
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 4.1: ADDITIONAL NOTES */}
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl relative overflow-hidden mb-4">
              <h4 className="text-[10px] font-light text-yellow-700 uppercase mb-1">
                หมายเหตุเพิ่มเติม (Additional Notes)
              </h4>
              <p className="text-xs text-yellow-900 leading-relaxed italic">
                {decoration_details.additional || "ไม่มีหมายเหตุเพิ่มเติม"}
              </p>
            </div>

            {/* SECTION 5: PICTURE GRID 2x2 (30% of A4) */}
            <div className="h-[89mm] flex flex-col">
              <h3 className="text-[10px] font-light text-black uppercase tracking-wider mb-2">
                ภาพประกอบอ้างอิง (Attachments)
              </h3>
              <div className="grid grid-cols-2 gap-2 flex-1 overflow-hidden">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center"
                  >
                    {design_images && design_images[idx] ? (
                      <img
                        src={design_images[idx]}
                        alt={`Design ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white">
                        <span className="text-[8px] text-slate-300">{idx + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default A4Report;
