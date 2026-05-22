import React from 'react';
import { User } from 'lucide-react';

interface ContactSectionProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  phone: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lineId: string;
  setLineId: (val: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
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
}) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 text-red-600 border-b pb-2">
        <User size={24} />
        <h2 className="text-xl font-light uppercase">1. ข้อมูลผู้ติดต่อ</h2>
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
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-mono bg-slate-50 text-red-600 font-light"
        />
        <input
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
          placeholder="Line ID"
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
        />
      </div>
    </section>
  );
};

export default ContactSection;
