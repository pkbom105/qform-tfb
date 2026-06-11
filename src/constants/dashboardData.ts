import { DashboardStats, CustomerRecord, OrderRecord } from "@/types";

export const dashboardStats: DashboardStats = {
  totalOrders: 156,
  pendingOrders: 23,
  completedOrders: 128,
  totalCustomers: 89,
  monthlyOrders: [12, 18, 15, 22, 19, 25, 30, 28, 35, 32, 40, 38],
  revenueData: [45000, 52000, 48000, 61000, 55000, 72000, 85000, 78000, 92000, 88000, 105000, 98000],
  popularProducts: [
    { name: "เสื้อโปโล Polo", count: 45 },
    { name: "เสื้อยืด T-shirt", count: 38 },
    { name: "เสื้อเชิ้ต Shirt", count: 22 },
    { name: "เสื้อเชฟ Chef Uniform", count: 18 },
    { name: "เสื้อแม่บ้าน House Maid", count: 15 },
  ],
};

export const mockCustomers: CustomerRecord[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `ลูกค้า ${String(i + 1).padStart(3, "0")}`,
  email: `customer${i + 1}@example.com`,
  company: `บริษัท ${String.fromCharCode(65 + (i % 26))} จำกัด`,
  phone: `0${String(Math.floor(Math.random() * 100) + 80).padStart(2, "0")}-${String(Math.floor(Math.random() * 10000000) + 1000000).padStart(7, "0")}`,
  lineId: `@customer${i + 1}`,
  totalOrders: Math.floor(Math.random() * 15) + 1,
  lastOrderDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString().split("T")[0],
  status: Math.random() > 0.2 ? "active" : "inactive",
}));

export const mockOrders: OrderRecord[] = Array.from({ length: 30 }, (_, i) => {
  const statuses: OrderRecord["status"][] = ["pending", "processing", "completed", "cancelled"];
  const products = ["เสื้อโปโล Polo", "เสื้อยืด T-shirt", "เสื้อเชิ้ต Shirt", "เสื้อเชฟ Chef Uniform", "เสื้อแม่บ้าน House Maid Uniform"];
  return {
    id: 1000 + i,
    customerName: `ลูกค้า ${String(i + 1).padStart(3, "0")}`,
    company: `บริษัท ${String.fromCharCode(65 + (i % 26))} จำกัด`,
    productType: products[i % products.length],
    quantity: Math.floor(Math.random() * 100) + 10,
    status: statuses[i % statuses.length],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000).toISOString().split("T")[0],
    totalAmount: Math.floor(Math.random() * 50000) + 5000,
  };
});