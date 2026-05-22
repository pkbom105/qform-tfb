import React from "react";
import { Send } from "lucide-react";
import ContactSection from "./ContactSection";
import OrderTabs from "./OrderTabs";

interface QuotationFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  phone: string;
  handlePhoneChange: (value: string) => void;
  lineId: string;
  setLineId: (id: string) => void;
  decorationTabs: any[];
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  addTab: () => void;
  updateTab: (index: number, data: any) => void;
  setColors: any[];
  productTypes: string[];
  fabricTypes: string[];
  sizeList: string[];
  currentTab: any;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, tabId: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  message: { type: string; text: string } | null;
  loading: boolean;
}

const QuotationForm: React.FC<QuotationFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  companyName,
  setCompanyName,
  phone,
  handlePhoneChange,
  lineId,
  setLineId,
  decorationTabs,
  activeTabIndex,
  setActiveTabIndex,
  addTab,
  updateTab,
  setColors,
  productTypes,
  fabricTypes,
  sizeList,
  currentTab,
  handleFileChange,
  handleSubmit,
  message,
  loading,
}) => {
  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-12">
      <ContactSection
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
      />

      <OrderTabs
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
      />

      {/* Message Feedback */}
      {message && (
        <div
          className={`p-4 rounded-2xl font-light text-center text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
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
            <p className="text-[15px] font-light text-green-700">
              Line Official
            </p>
            <h3 className="text-xl font-light text-black">
              @toffyboutique
            </h3>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-[320px] py-5 bg-red-600 text-white font-light rounded-full text-xl shadow-xl hover:bg-slate-900 transition-all flex justify-center items-center gap-3 disabled:opacity-50"
        >
          <Send size={20} />
          {loading ? "บันทึก..." : "ส่งข้อมูลเสนอราคา"}
        </button>
      </div>
    </form>
  );
};

export default QuotationForm;
