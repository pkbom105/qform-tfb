"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Printer, Loader2, Calendar as CalendarIcon, X } from "lucide-react";
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

const STATUS_FILTERS = [
  { value: "", label: "ทั้งหมด", dot: "bg-slate-400" },
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
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build query params
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (statusFilter) params.set("status", statusFilter);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    return params.toString();
  }, [debouncedSearch, statusFilter, startDate, endDate]);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const qs = buildQuery();
        const res = await fetch(`/api/customers${qs ? `?${qs}` : ""}`);
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
  }, [buildQuery]);

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

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setShowCalendar(false);
  };

  return (
    <div className="space-y-8">
      {/* Row 1: Title + Filter Bar (Calendar + Status group + Clear) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-black">Order-QForm</h1>
          <p className="text-base text-black font-light mt-1">
            จัดการข้อมูลคำสั่งซื้อทั้งหมด ({total} รายการ)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
        {/* Calendar Date Range */}
        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-light transition-all ${
              showCalendar || startDate
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <CalendarIcon size={16} />
            {startDate && endDate
              ? `${startDate} → ${endDate}`
              : startDate
              ? `ตั้งแต่ ${startDate}`
              : "เลือกวันที่"}
            {(startDate || endDate) && (
              <X
                size={14}
                className="ml-1 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  clearDateFilter();
                }}
              />
            )}
          </button>

          {showCalendar && (
            <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-[320px]">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-light mb-1 block">วันที่เริ่มต้น</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-light outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-light mb-1 block">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-light outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={clearDateFilter}
                    className="px-4 py-1.5 text-sm text-slate-500 hover:text-slate-800 font-light"
                  >
                    ล้าง
                  </button>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="px-4 py-1.5 text-sm bg-slate-800 text-white rounded-lg font-light hover:bg-slate-700"
                  >
                    ตกลง
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Group Button */}
        <div className="inline-flex items-center rounded-lg border border-slate-200 overflow-hidden bg-white">
          {STATUS_FILTERS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-2 text-sm font-light transition-all ${
                statusFilter === opt.value
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              } ${opt.value !== "" ? "border-l border-slate-200" : ""}`}
            >
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${opt.dot}`}></span>
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {(statusFilter || startDate || endDate) && (
          <button
            onClick={() => {
              setStatusFilter("");
              clearDateFilter();
            }}
            className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 hover:text-red-800 font-light"
          >
            <X size={14} />
            ล้างทั้งหมด
          </button>
        )}
        </div>
      </div>

      {/* Table */}
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
                    <th className="hidden md:table-cell p-4 text-sm font-light text-black uppercase">บริษัท</th>
                    <th className="p-4 text-sm font-light text-black uppercase">เบอร์โทร</th>
                    <th className="hidden md:table-cell p-4 text-sm font-light text-black uppercase">อีเมล</th>
                    <th className="hidden md:table-cell p-4 text-sm font-light text-black uppercase text-center">จำนวนชุด</th>
                    <th className="hidden md:table-cell p-4 text-sm font-light text-black uppercase">สถานะ</th>
                    <th className="p-4 text-sm font-light text-black uppercase text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-base text-black font-light">
                        {debouncedSearch || statusFilter || startDate || endDate
                          ? "ไม่พบรายการที่ค้นหา"
                          : "ยังไม่มีข้อมูลคำสั่งซื้อ"}
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
                          <td className="hidden md:table-cell p-4 text-sm font-light text-black">{customer.company}</td>
                          <td className="p-4 text-sm font-light text-black">{customer.phone}</td>
                          <td className="hidden md:table-cell p-4 text-sm font-light text-black">{customer.email}</td>
                          <td className="hidden md:table-cell p-4 text-center text-sm font-light text-black">{customer.setCount}</td>
                          <td className="hidden md:table-cell p-4">
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
                                {STATUS_FILTERS.filter(f => f.value).map((opt) => (
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