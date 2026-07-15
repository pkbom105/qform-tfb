"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Chart from "@/components/dashboard/Chart";
import { dashboardStats } from "@/constants/dashboardData";

const AnalyticsContent: React.FC = () => {
  const totalRevenue = dashboardStats.revenueData.reduce((a, b) => a + b, 0);
  const avgOrderValue = Math.round(totalRevenue / dashboardStats.totalOrders);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-green-50">
                <DollarSign size={22} className="text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-light text-black">
              {totalRevenue.toLocaleString()}
            </p>
            <p className="text-base text-black font-light mt-1">
              รายได้รวม (บาท)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50">
                <ShoppingBag size={22} className="text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-light text-black">
              {avgOrderValue.toLocaleString()}
            </p>
            <p className="text-base text-black font-light mt-1">
              มูลค่าออเดอร์เฉลี่ย (บาท)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-50">
                <Users size={22} className="text-purple-600" />
              </div>
            </div>
            <p className="text-4xl font-light text-black">
              {dashboardStats.totalCustomers}
            </p>
            <p className="text-base text-black font-light mt-1">
              ลูกค้าทั้งหมด
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-50">
                <TrendingUp size={22} className="text-red-600" />
              </div>
            </div>
            <p className="text-4xl font-light text-black">
              {Math.round((dashboardStats.completedOrders / dashboardStats.totalOrders) * 100)}%
            </p>
            <p className="text-base text-black font-light mt-1">
              อัตราความสำเร็จ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>รายได้รายเดือน</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            data={dashboardStats.revenueData}
            height={280}
            color="bg-green-600"
            labels={["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]}
          />
        </CardContent>
      </Card>

      {/* Orders & Revenue Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ยอดออเดอร์รายเดือน</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={dashboardStats.monthlyOrders}
              height={200}
              color="bg-blue-600"
              labels={["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>สินค้าขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.popularProducts.map((product, index) => {
                const maxCount = dashboardStats.popularProducts[0].count;
                const percentage = (product.count / maxCount) * 100;
                return (
                  <div key={product.name} className="space-y-1">
                    <div className="flex justify-between text-base">
                      <span className="font-light text-black">{product.name}</span>
                      <span className="font-light text-black">{product.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsContent;