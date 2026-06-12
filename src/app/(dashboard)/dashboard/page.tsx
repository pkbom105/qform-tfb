"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  Loader2,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import A4PreviewModal from "@/components/dashboard/A4PreviewModal";

export default function DashboardOverview() {
  const [previewOrderId, setPreviewOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: {
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
      totalCustomers: number;
    };
    popularProducts: { name: string; count: number }[];
    recentOrders: {
      id: number;
      customerName: string;
      company: string;
      productType: string;
      quantity: number;
      status: string;
      createdAt: string;
    }[];
  } | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  const stats = data?.stats;
  const ds = [
    {
      label: "ออเดอร์ทั้งหมด",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "รอดำเนินการ",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "สำเร็จแล้ว",
      value: stats?.completedOrders ?? 0,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "ลูกค้าทั้งหมด",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-light text-black">ภาพรวมระบบ</h1>
          <p className="text-base text-black font-light mt-1">
            สรุปข้อมูลล่าสุดจากฐานข้อมูล
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ds.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon size={22} className={stat.color} />
                </div>
              </div>
              <p className="text-4xl font-light text-black">{stat.value}</p>
              <p className="text-base text-black font-light mt-1">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Products & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>สินค้าที่สั่งผลิตล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(data?.popularProducts ?? []).length === 0 ? (
                <p className="text-base text-black font-light text-center py-8">
                  ยังไม่มีข้อมูลคำสั่งซื้อ
                </p>
              ) : (
                (data?.popularProducts ?? []).map((product, index) => {
                  const maxCount = (data?.popularProducts ?? [])[0]?.count || 1;
                  const percentage = (product.count / maxCount) * 100;
                  return (
                    <div key={product.name} className="space-y-1">
                      <div className="flex justify-between text-base">
                        <span className="font-light text-black">
                          {index + 1}. {product.name}
                        </span>
                          <span className="font-light text-black">
                            {product.count}
                          </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>จัดการระบบ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/form"
              className="block w-full text-center py-3 bg-red-600 text-white rounded-xl font-light hover:bg-slate-900 transition-all shadow-lg"
            >
              + สร้างคำสั่งซื้อใหม่
            </a>
            <a
              href="/dashboard/order-qform"
              className="block w-full text-center py-3 border border-slate-200 text-black rounded-xl font-light hover:bg-slate-50 transition-all"
            >
              ดูรายชื่อลูกค้า
            </a>
            <a
              href="/dashboard/analytics"
              className="block w-full text-center py-3 border border-slate-200 text-black rounded-xl font-light hover:bg-slate-50 transition-all"
            >
              วิเคราะห์ข้อมูล
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>ออเดอร์ล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-sm font-light text-black uppercase">ออเดอร์</th>
                  <th className="pb-3 text-sm font-light text-black uppercase">ลูกค้า</th>
                  <th className="pb-3 text-sm font-light text-black uppercase">สินค้า</th>
                  <th className="pb-3 text-sm font-light text-black uppercase">จำนวน</th>
                  <th className="pb-3 text-sm font-light text-black uppercase">สถานะ</th>
                  <th className="pb-3 text-sm font-light text-black uppercase">วันที่</th>
                  <th className="pb-3 text-sm font-light text-black uppercase text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-base text-black font-light">
                      ยังไม่มีข้อมูลคำสั่งซื้อ
                    </td>
                  </tr>
                ) : (
                  (data?.recentOrders ?? []).map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 text-base font-light text-black">#{order.id}</td>
                      <td className="py-3 text-base font-light text-black">{order.customerName}</td>
                      <td className="py-3 text-base font-light text-black">{order.productType}</td>
                      <td className="py-3 text-base font-light text-black">{order.quantity}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "success"
                              : order.status === "active"
                                ? "success"
                                : order.status === "pending"
                                  ? "warning"
                                  : order.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                          }
                        >
                          {order.status === "completed"
                            ? "สำเร็จ"
                            : order.status === "active"
                              ? "ใช้งาน"
                              : order.status === "pending"
                                ? "รอดำเนินการ"
                                : order.status === "processing"
                                  ? "กำลังดำเนินการ"
                                  : "ยกเลิก"}
                        </Badge>
                      </td>
                      <td className="py-3 text-base font-light text-black">{order.createdAt}</td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => setPreviewOrderId(order.id)}
                          className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-full border border-red-200 hover:border-red-600 transition-all font-light"
                        >
                          <FileText size={12} />
                          A4
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* A4 Preview Modal */}
      {previewOrderId !== null && (
        <A4PreviewModal
          orderId={previewOrderId}
          onClose={() => setPreviewOrderId(null)}
        />
      )}
    </div>
  );
}