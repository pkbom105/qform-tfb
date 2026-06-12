"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Printer, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import A4PreviewModal from "@/components/dashboard/A4PreviewModal";

const PAGE_SIZE = 35;

interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  lineId: string;
  totalOrders: number;
  lastOrderId: number | null;
  reportName: string;
  lastOrderDate: string;
  status: string;
  setCount: number;
}

const STATUS_STYLES: Record<string, { label: string; dot: string; bg: string; text: string; border: string }> = {
  pending: { label: "มาใหม่", dot: "bg-purple-600", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  processing: { label: "ดำเนินการ", dot: "bg-yellow-500", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  producing: { label: "ส่งผลิต", dot: "bg-green-600", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  cancelled: { label: "ยกเลิก", dot: "bg-red-600", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "มาใหม่", dot: "bg-purple-600" },
  { value: "processing", label: "ดำเนินการ", dot: "bg-yellow-500" },
  { value: "producing", label: "ส่งผลิต", dot: "bg-green-600" },
  { value: "cancelled", label: "ยกเลิก", dot: "bg-red-600" },
];

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
    setCurrentPage(1);
  }, [debouncedSearch]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return customers.slice(start, start + PAGE_SIZE);
  }, [customers, currentPage]);

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await fetch("/api/orders/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      // Optimistically update local state
      setCustomers((prev) =>
        prev.map((c) => (c.lastOrderId === orderId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error("Failed to update status", err);
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
          <h1 className="text-3xl font-light text-black">Order-QForm</h1>
          <p className="text-base text-black font-light mt-1">
            จัดการข้อมูลคำสั่งซื้อทั้งหมด ({total} รายการ)
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
                    <th className="p-4 text-sm font-light text-black uppercase">วันที่</th>
                    <th className="p-4 text-sm font-light text-black uppercase">Order-Form Number</th>
                    <th className="p-4 text-sm font-light text-black uppercase">ชื่อลูกค้า</th>
                    <th className="p-4 text-sm font-light text-black uppercase">บริษัท</th>
                    <th className="p-4 text-sm font-light text-black uppercase">เบอร์โทร</th>
                    <th className="p-4 text-sm font-light text-black uppercase">อีเมล</th>
                    <th className="p-4 text-sm font-light text-black uppercase text-center">จำนวนชุด</th>
                    <th className="p-4 text-sm font-light text-black uppercase">สถานะ</th>
                    <th className="p-4 text-sm font-light text-black uppercase text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-base text-black font-light">
                        {debouncedSearch ? "ไม่พบรายการที่ค้นหา" : "ยังไม่มีข้อมูลคำสั่งซื้อ"}
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((customer) => {
                      const s = STATUS_STYLES[customer.status] || STATUS_STYLES.pending;
                      return (
                        <tr key={customer.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-sm font-light text-black">{customer.lastOrderDate}</td>
                          <td className="p-4 text-sm font-light text-black">{customer.reportName}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs text-black font-light">
                                {customer.name.charAt(0)}
                              </div>
                              <span className="text-sm font-light text-black">{customer.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-light text-black">{customer.company}</td>
                          <td className="p-4 text-sm font-light text-black">{customer.phone}</td>
                          <td className="p-4 text-sm font-light text-black">{customer.email}</td>
                          <td className="p-4 text-center text-sm font-light text-black">{customer.setCount}</td>
                          <td className="p-4">
                            <div className="relative inline-block">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 z-10">
                                <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                              </div>
                              <select
                                value={customer.status}
                                onChange={(e) => handleStatusChange(customer.lastOrderId!, e.target.value)}
                                className={`appearance-none text-xs font-light rounded-lg pl-7 pr-8 py-1.5 outline-none cursor-pointer border ${s.border} ${s.bg} ${s.text}`}
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>  {opt.label}</option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg className={`w-3 h-3 ${s.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handlePrint(customer)}
                                disabled={!customer.lastOrderId}
                                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-white hover:bg-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-600 transition-all font-light disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Printer size={12} />
                                Print
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {previewOrderId !== null && (
        <A4PreviewModal orderId={previewOrderId} onClose={() => setPreviewOrderId(null)} />
      )}
    </div>
  );
}