import React from "react";
import { Shirt, FileText, Upload, Plus } from "lucide-react";

interface OrderTabsProps {
  decorationTabs: any[];
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  addTab: () => void;
  updateTab: (index: number, data: any) => void;
  setColors: any[];
  productTypes: string[];
  fabricTypes: string[];
  sizeList: string[];
  currentTab: any; // Add currentTab prop
  // Remove selectedFiles and setSelectedFiles as they are now per-tab
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    tabId: string,
  ) => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({
  decorationTabs,
  activeTabIndex,
  setActiveTabIndex,
  addTab,
  updateTab,
  setColors,
  productTypes,
  fabricTypes,
  sizeList,
  currentTab, // Pass currentTab
  // Remove selectedFiles and setSelectedFiles
  handleFileChange,
}) => {
  // currentTab and activeColor can remain as is, or be passed down
  // const currentTab = decorationTabs[activeTabIndex]; // Now passed as prop
  const activeColor = setColors[activeTabIndex % setColors.length];

  return (
    <section className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        {decorationTabs.map((tab, index) => {
          const tabColor = setColors[index % setColors.length];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabIndex(index)}
              className={`px-4 py-2 rounded-t-lg font-light text-sm whitespace-nowrap transition-all ${
                activeTabIndex === index
                  ? `${tabColor.bg} text-white shadow-lg`
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              Set {index + 1}
            </button>
          );
        })}
        {decorationTabs.length < 5 && (
          <button
            type="button"
            onClick={addTab}
            className="ml-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-light transition-all flex items-center gap-1"
          >
            <Plus size={18} /> Add
          </button>
        )}
      </div>

      {/* Tab Content - Sections 2-4 */}
      <div
        className={`space-y-8 border-l-4 ${activeColor.border} pl-6 transition-colors duration-300`}
      >
        {/* Section 2: เนื้อผ้าและประเภทสินค้า */}
        <div className="space-y-6">
          <div
            className={`flex items-center gap-3 ${activeColor.text} border-b pb-2`}
          >
            <Shirt size={24} />
            <h2 className="text-xl font-light uppercase">
              2. เนื้อผ้าและประเภทสินค้า
            </h2>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-light text-black uppercase">
                ประเภทสินค้า
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {productTypes.map((t) => (
                  <label
                    key={t}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                      currentTab?.productType === t
                        ? `${activeColor.lightBg} ${activeColor.border.replace("600", "200")} shadow-sm`
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={currentTab?.productType === t}
                      onChange={() =>
                        updateTab(activeTabIndex, { productType: t })
                      }
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        currentTab?.productType === t
                          ? activeColor.border
                          : "border-slate-300"
                      }`}
                    >
                      {currentTab?.productType === t && (
                        <div
                          className={`w-2 h-2 rounded-full ${activeColor.bg}`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm font-light ${currentTab?.productType === t ? "text-black" : "text-black"}`}
                    >
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-light text-black uppercase">
                เนื้อผ้าที่ต้องการ
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {fabricTypes.map((f) => (
                  <label
                    key={f}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                      currentTab?.fabricType === f
                        ? `${activeColor.lightBg} ${activeColor.border.replace("600", "200")} shadow-sm`
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={currentTab?.fabricType === f}
                      onChange={() =>
                        updateTab(activeTabIndex, { fabricType: f })
                      }
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        currentTab?.fabricType === f
                          ? activeColor.border
                          : "border-slate-300"
                      }`}
                    >
                      {currentTab?.fabricType === f && (
                        <div
                          className={`w-2 h-2 rounded-full ${activeColor.bg}`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm font-light ${currentTab?.fabricType === f ? "text-black" : "text-black"}`}
                    >
                      {f}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-light text-black uppercase">
                รายละเอียดอื่นๆ (เช่น ปก, แขน, สาบ)
              </label>
              <textarea
                value={currentTab?.specs || ""}
                onChange={(e) =>
                  updateTab(activeTabIndex, { specs: e.target.value })
                }
                rows={3}
                className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 ${activeColor.ring}`}
                placeholder="ระบุรายละเอียดเพิ่มเติม..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: ตารางไซส์และจำนวน */}
        <div className="space-y-6">
          <div
            className={`flex items-center gap-3 ${activeColor.text} border-b pb-2`}
          >
            <FileText size={24} />
            <h2 className="text-xl font-light uppercase">
              3. ตารางไซส์และจำนวน
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-light text-black uppercase">
                    Size
                  </th>
                  {sizeList.map((s) => (
                    <th
                      key={s}
                      className="p-4 text-center text-xs font-light text-black"
                    >
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 text-xs font-light text-black bg-slate-50/50 uppercase">
                    รอบอก (นิ้ว)
                  </td>
                  {sizeList.map((s) => (
                    <td key={s} className="p-2">
                      <input
                        type="number"
                        value={currentTab?.sizeData[s]?.chest || ""}
                        onChange={(e) => {
                          const newSizeData = { ...currentTab.sizeData };
                          newSizeData[s] = {
                            ...newSizeData[s],
                            chest: e.target.value,
                          };
                          updateTab(activeTabIndex, { sizeData: newSizeData });
                        }}
                        className="w-full p-2 text-center border-b border-transparent focus:border-red-500 outline-none text-sm font-light"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-xs font-light text-black bg-slate-50/50 uppercase">
                    จำนวน (ตัว)
                  </td>
                  {sizeList.map((s) => (
                    <td key={s} className="p-2">
                      <input
                        type="number"
                        value={currentTab?.sizeData[s]?.qty || ""}
                        onChange={(e) => {
                          const newSizeData = { ...currentTab.sizeData };
                          newSizeData[s] = {
                            ...newSizeData[s],
                            qty: e.target.value,
                          };
                          updateTab(activeTabIndex, { sizeData: newSizeData });
                        }}
                        className="w-full p-2 text-center bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm font-light"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Decoration & Remarks within Tab */}
        <div className="space-y-6">
          {/* ยอดรวม - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden h-[62px]">
              <div className="bg-slate-100 px-4 py-3 font-light text-[13px] text-black w-40 border-r">
                ยอดรวมจากตาราง
              </div>
              <div className="flex-1 px-4 py-3 text-xl font-light text-black bg-white">
                {currentTab?.totalQuantity || 0}
              </div>
            </div>
            <div
              className={`flex items-center border-2 ${activeColor.border} rounded-xl overflow-hidden h-[62px]`}
            >
              <div
                className={`${activeColor.lightBg} px-4 py-3 font-light text-[13px] ${activeColor.text} w-40 border-r`}
              >
                ยอดรวมโดยประมาณ
              </div>
              <input
                type="number"
                value={currentTab?.manualTotal || ""}
                onChange={(e) =>
                  updateTab(activeTabIndex, { manualTotal: e.target.value })
                }
                className="flex-1 px-4 py-3 text-xl font-light outline-none bg-white"
                placeholder="ระบุ..."
              />
            </div>
          </div>

          {/* งานพิมพ์ (Screen / DTF) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <div className={`w-2 h-2 ${activeColor.bg} rounded-full`} />
              <span className="text-sm font-light uppercase">
                งานพิมพ์ (Screen / DTF)
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((pos) => {
                const titleKey =
                  pos === 1 ? "printTitle" : `printPos${pos}Title`;
                const sizeKey = pos === 1 ? "printSize" : `printPos${pos}Size`;
                return (
                  <div
                    key={pos}
                    className="lg:col-span-1 p-4 bg-slate-50 rounded-2xl border space-y-3"
                  >
                    <div className="text-xs font-light text-black uppercase">
                      ตำแหน่งที่ {pos}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        value={currentTab?.[titleKey] || ""}
                        onChange={(e) =>
                          updateTab(activeTabIndex, {
                            [titleKey]: e.target.value,
                          })
                        }
                        className="p-2 bg-white border rounded-lg outline-none text-xs"
                        placeholder="หัวข้อ/จุดที่พิมพ์"
                      />
                      <input
                        value={currentTab?.[sizeKey] || ""}
                        onChange={(e) =>
                          updateTab(activeTabIndex, {
                            [sizeKey]: e.target.value,
                          })
                        }
                        className="p-2 bg-white border rounded-lg outline-none text-xs"
                        placeholder="ขนาด"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* งานปัก (Embroidery) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <div className={`w-2 h-2 ${activeColor.bg} rounded-full`} />
              <span className="text-sm font-light uppercase">
                งานปัก (Embroidery)
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((pos) => {
                const titleKey =
                  pos === 1 ? "embroideryTitle" : `embroideryPos${pos}Title`;
                const sizeKey =
                  pos === 1 ? "embroiderySize" : `embroideryPos${pos}Size`;
                return (
                  <div
                    key={pos}
                    className="lg:col-span-1 p-4 bg-slate-50 rounded-2xl border space-y-3"
                  >
                    <div className="text-xs font-light text-black uppercase">
                      ตำแหน่งที่ {pos}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        value={currentTab?.[titleKey] || ""}
                        onChange={(e) =>
                          updateTab(activeTabIndex, {
                            [titleKey]: e.target.value,
                          })
                        }
                        className="p-2 bg-white border rounded-lg outline-none text-xs"
                        placeholder="หัวข้อ/ตำแหน่งที่ปัก"
                      />
                      <input
                        value={currentTab?.[sizeKey] || ""}
                        onChange={(e) =>
                          updateTab(activeTabIndex, {
                            [sizeKey]: e.target.value,
                          })
                        }
                        className="p-2 bg-white border rounded-lg outline-none text-xs"
                        placeholder="ขนาด"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: ระบุหมายเหตุ */}
          <div className="space-y-4">
            <div
              className={`flex items-center gap-2 ${activeColor.text} border-b pb-2`}
            >
              <FileText size={20} />
              <h2 className="text-lg font-light uppercase">
                4. ระบุหมายเหตุ (แก้ไขได้)
              </h2>
            </div>
            <textarea
              value={currentTab?.additionalNeeds || ""}
              onChange={(e) =>
                updateTab(activeTabIndex, { additionalNeeds: e.target.value })
              }
              rows={4}
              className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 ${activeColor.ring}`}
              placeholder="ระบุหมายเหตุหรือความต้องการเพิ่มเติมอื่นๆ..."
            />

            {/* Section File Upload */}
            <div className="space-y-4 pt-4 border-t border-dashed">
              <label className="text-sm font-light text-black uppercase">
                แนบไฟล์แบบเสื้อ (สูงสุด 4 รูป)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50 flex flex-col items-center justify-center min-h-[160px] group hover:border-red-400 transition-colors">
                <Upload className="text-black group-hover:text-red-400 mb-2" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, currentTab.id)}
                  className="hidden"
                  id="f-up"
                />
                <label
                  htmlFor="f-up"
                  className="cursor-pointer bg-slate-900 text-white px-8 py-2 rounded-full font-light text-xs hover:bg-red-600 shadow-lg"
                >
                  เลือกไฟล์รูปภาพ
                </label>
                <div className="mt-4 flex flex-wrap gap-3">
                  {currentTab?.selectedFiles.map((f: File, i: number) => (
                    <div
                      key={i}
                      className="relative group"
                    >
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateTab(activeTabIndex, {
                            selectedFiles: currentTab.selectedFiles.filter(
                              (_: File, idx: number) => idx !== i,
                            ),
                          })
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderTabs;
