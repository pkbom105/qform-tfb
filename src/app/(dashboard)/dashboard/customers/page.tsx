"use client";

import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, FileText, Printer, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import A4PreviewModal from "@/components/dashboard/A4PreviewModal";

interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  lineId: string;
  totalOrders: number;
  lastOrderId: number | null;
  lastOrderDate: string;
  status: "active" | "inactive";
}

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [previewOrderId, setPreviewOrderId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const params = debouncedSearch
          ? `?search=${encodeURIComponent(debouncedSearch)}`
          : "";
        const res = await fetch(`/api/customers${params}`);
        const json = await res.json();
        if (json.success) {
          setCustomers(json.data.customers);
          setTotal(json.data.total);
        }
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [debouncedSearch]);

  const handleA4View = (customer: CustomerRecord) => {
    if (customer.lastOrderId) {
      setPreviewOrderId(customer.lastOrderId);
    } else {
      alert("ลูกค้ารายนี้ยังไม่มีออเดอร์");
    }
  };

  const handlePrint = (customer: CustomerRecord) => {
    if (customer.lastOrderId) {
      setPreviewOrderId(customer.lastOrderId);
    } else {
      alert("ลูกค้ารายนี้ยังไม่มีออเดอร์");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-black">ลูกค้า</h1>
          <p className="text-base text-black font-light mt-1">
            จัดการข้อมูลลูกค้าทั้งหมด ({total} ราย)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 w-full sm:w-80">
          <Search size={18} className="text-black" />
          <input
            type="text"
            placeholder="ค้นหาลูกค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-base font-light text-black w-full placeholder:text-black"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-black" size={28} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="p-4 text-sm font-light text-black uppercase">ชื่อลูกค้า</th>
                    <th className="p-4 text-sm font-light text-black uppercase">บริษัท</th>
                    <th className="p-4 text-sm font-light text-black uppercase">อีเมล</th>
                    <th className="p-4 text-sm font-light text-black uppercase">เบอร์โทร</th>
                    <th className="p-4 text-sm font-light text-black uppercase">ออเดอร์</th>
                    <th className="p-4 text-sm font-light text-black uppercase">สถานะ</th>
                    <th className="p-4 text-sm font-light text-black uppercase">ออเดอร์ล่าสุด</th>
                    <th className="p-4 text-sm font-light text-black uppercase text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-base text-black font-light">
                        {debouncedSearch ? "ไม่พบลูกค้าที่ค้นหา" : "ยังไม่มีข้อมูลลูกค้า"}
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm text-black font-light">
                              {customer.name.charAt(0)}
                            </div>
                            <span className="text-base font-light text-black">{customer.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-base font-light text-black">{customer.company}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-base font-light text-black">
                            <Mail size={14} className="text-black" />
                            {customer.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-base font-light text-black">
                            <Phone size={14} className="text-black" />
                            {customer.phone}
                          </div>
                        </td>
                        <td className="p-4 text-base font-light text-black">{customer.totalOrders}</td>
                        <td className="p-4">
                          <Badge variant={customer.status === "active" ? "success" : "secondary"}>
                            {customer.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                          </Badge>
                        </td>
                        <td className="p-4 text-base font-light text-black">{customer.lastOrderDate}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleA4View(customer)}
                              disabled={!customer.lastOrderId}
                              className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-full border border-red-200 hover:border-red-600 transition-all font-light disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <FileText size={14} />
                              A4
                            </button>
                            <button
                              onClick={() => handlePrint(customer)}
                              disabled={!customer.lastOrderId}
                              className="inline-flex items-center gap-1 text-sm text-black hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-800 transition-all font-light disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Printer size={14} />
                              Print
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {previewOrderId !== null && (
        <A4PreviewModal orderId={previewOrderId} onClose={() => setPreviewOrderId(null)} />
      )}
    </div>
  );
}